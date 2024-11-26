// src/app/core/error-handler.service.ts

import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {}

  handleError(error: any): void {
    // Get the router instance from the injector to navigate on errors if needed
    const router = this.injector.get(Router);
    
    // Log the error (could be sent to an external logging service)
    console.error('An error occurred:', error);

    // Optional: Redirect to an error page
    router.navigate(['/error']);  // redirect to a custom error page
    
    // Optionally, rethrow the error if you want to propagate it
    // throw error;
  }
}
