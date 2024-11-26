import { Component, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isDarkMode = false; // Default mode

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Retrieve user preference from localStorage
    const storedTheme = localStorage.getItem('darkMode');
    this.isDarkMode = storedTheme === 'true';

    // Apply the theme to the body
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  toggleTheme(isDark: boolean): void {
    this.isDarkMode = isDark;

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }

    // Save user preference to localStorage
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
}
