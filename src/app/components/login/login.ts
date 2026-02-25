import { Component } from '@angular/core';
import { Button } from '../../components/button/button';

@Component({
  standalone: true,
  selector: 'jwpaisley-login',
  imports: [Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  handleClick() {
    alert('Login button clicked');
  }
}
