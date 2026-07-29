import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Recipe, RecipePage, RecipeService } from '../../services/recipe-service/recipe-service';
import { Subject, takeUntil } from 'rxjs';
import { Loader } from '../../components/loader/loader';
import { RecipesTable } from '../../components/recipes-table/recipes-table';
import { UserService } from '../../services/user-service/user-service';
import { Button } from '../../components/button/button';
import { Router } from '@angular/router';
import { Tag } from '../../components/tag/tag';
import { TagListComponent } from '../../components/tag-list/tag-list';
import { RecipeTagService, RecipeTag } from '../../services/recipe-tag-service/recipe-tag-service';
import { DialogService } from '../../services/dialog-service/dialog-service';

@Component({
  selector: 'jwpaisley-recipes',
  imports: [Loader, RecipesTable, Button, TagListComponent],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit, OnDestroy {
  protected isLoadingRecipes = true;
  protected isLoadingTags = true;
  protected isLoadingMore = false;
  protected isUserAdmin = false;
  protected recipes: Recipe[] = [];
  protected hasMoreRecipes = false;
  protected nextPageToken: string | null = null;
  protected destroy$ = new Subject<void>();
  protected tags: Tag[] = [];
  private router = inject(Router);

  constructor(
    private recipeService: RecipeService,
    private recipeTagService: RecipeTagService,
    private userService: UserService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  private loadRecipes(pageToken?: string): void {
    if (pageToken) {
      this.isLoadingMore = true;
    } else {
      this.isLoadingRecipes = true;
    }

    const selectedTagIds = this.tags.filter((tag) => tag.selected).map((tag) => tag.id);

    this.recipeService.getRecipes(pageToken, selectedTagIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page: RecipePage) => {
          this.recipes = pageToken ? [...this.recipes, ...page.items] : page.items;
          this.nextPageToken = page.nextPageToken;
          this.hasMoreRecipes = !!page.nextPageToken;
          this.isLoadingRecipes = false;
          this.isLoadingMore = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoadingRecipes = false;
          this.isLoadingMore = false;
          this.cdr.detectChanges();
        },
      });
  }

  protected loadMoreRecipes(): void {
    if (!this.hasMoreRecipes || !this.nextPageToken) {
      return;
    }

    this.loadRecipes(this.nextPageToken);
  }

  ngOnInit() {
    this.loadRecipes();
    this.loadRecipeTags();

    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isUserAdmin = this.userService.isUserAdmin();
        this.cdr.detectChanges();
      });
  }
    
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRecipeTags(): void {
    this.recipeTagService.getRecipeTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recipeTags: RecipeTag[]) => {
          this.tags = recipeTags.map((recipeTag) => ({
            id: recipeTag.id,
            title: recipeTag.name,
            selected: false,
          }));
          this.isLoadingTags = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.tags = [];
          this.isLoadingTags = false;
          this.cdr.detectChanges();
        },
      });
  }

  protected redirectToCreateRecipePage(): void {
    this.router.navigate(['/recipe/new']);
  }

  protected async openAddRecipeTagDialog(): Promise<void> {
    const result = await this.dialogService.openAddRecipeTagDialog<{ name: string; description?: string | null }>({
      title: 'create recipe tag',
      icon: 'local_offer',
      text: 'add a reusable tag that can be attached to recipes.',
      confirmLabel: 'create tag',
      cancelLabel: 'cancel',
    });

    if (!result.confirmed || !result.value?.name) {
      return;
    }

    this.recipeTagService.createRecipeTag({
      id: '',
      name: result.value.name,
      description: result.value.description ?? null,
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadRecipeTags(),
        error: () => this.loadRecipeTags(),
      });
  }

  protected onTagSelected(tagId: string): void {
    this.tags = this.tags.map((tag) => tag.id === tagId ? { ...tag, selected: true } : tag);
    this.loadRecipes();
    this.cdr.detectChanges();
  }

  protected onTagUnselected(tagId: string): void {
    this.tags = this.tags.map((tag) => tag.id === tagId ? { ...tag, selected: false } : tag);
    this.loadRecipes();
    this.cdr.detectChanges();
  }
}
