import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import { HomeComponent } from './home/home.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import { GeneratorComponent } from './generator/generator.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { UnlockComponent } from './unlock/unlock.component';
import { DetailedComponent } from './detailed/detailed.component';
import { AddAccountComponent } from './add-account/add-account.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ClipboardModule } from 'ngx-clipboard';
import { ConfirmComponent } from './confirm/confirm.component';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { TokenService } from './services/token.service';
import { ErrorComponent } from './error/error.component';
import { EditComponent } from './edit/edit.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    GeneratorComponent,
    UnlockComponent,
    DetailedComponent,
    AddAccountComponent,
    ConfirmComponent,
    SettingsComponent,
    ErrorComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatBadgeModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    ClipboardModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    UnlockComponent,
    DetailedComponent,
    AddAccountComponent,
    ConfirmComponent, 
    EditComponent
  ],
  providers: [AuthGuard, 
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenService,
    multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
