import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule if needed
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service'; // Import other services if needed

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule, 
    BrowserModule,
    HttpClientModule 
  ],
  providers: [ApiService], 
  bootstrap: [AppComponent], 
  schemas: [NO_ERRORS_SCHEMA] 
})
export class AppModule { }
