import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsPredictionsPage } from './sports-predictions';
import { Leagues } from '../../components/sports-predictions/leagues/leagues';
import { LeagueDetails } from '../../components/sports-predictions/league-details/league-details';
import { Games } from '../../components/sports-predictions/games/games';

const routes: Routes = [
  {
    path: '',
    component: SportsPredictionsPage,
    children: [
      {
        path: '',
        redirectTo: 'leagues',
        pathMatch: 'full',
      },
      {
        path: 'leagues',
        component: Leagues,
      },
      {
        path: 'games',
        component: Games,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SportsPredictionsRoutingModule {}
