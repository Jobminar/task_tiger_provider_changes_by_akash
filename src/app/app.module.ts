import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import MatProgressSpinnerModule
import { MatTabsModule } from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LanguageComponent } from './language/language.component';
import { LogInComponent } from './log-in/log-in.component';
import { VerifyComponent } from './verify/verify.component';
import { AboutUserComponent } from './about-user/about-user.component';
import { SelectWorkComponent } from './select-work/select-work.component';
import { AboutWorkComponent } from './about-work/about-work.component';
import { WorkExperianceComponent } from './work-experiance/work-experiance.component';
import { AadharVerificationComponent } from './aadhar-verification/aadhar-verification.component';
import { PancardComponent } from './pancard/pancard.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { HomeComponent } from './home/home.component';
import { FotterComponent } from './fotter/fotter.component';
import { CreditComponent } from './credit/credit.component';
import { MenuComponent } from './menu/menu.component';
import { VisitingCardComponent } from './visiting-card/visiting-card.component';
import { ReferAndEarnComponent } from './refer-and-earn/refer-and-earn.component';
import { AwardsComponent } from './awards/awards.component';
import { HelpsComponent } from './helps/helps.component';
import { TargetComponent } from './target/target.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EarningsComponent } from './earnings/earnings.component';
import { WaitingPageComponent } from './waiting-page/waiting-page.component';
import { NotificationComponent } from './notification/notification.component';
import { CalenderComponent } from './calender/calender.component';
import { JobHistoryComponent } from './job-history/job-history.component';
import { AddCreditComponent } from './add-credit/add-credit.component';
import { FinancialDetailsComponent } from './financial-details/financial-details.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { IdentityVerificationComponent } from './identity-verification/identity-verification.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { DemoComponent } from './demo/demo.component';
import { InductionComponent } from './induction/induction.component';

import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { StartComponent } from './start/start.component';
import { SelectAccountComponent } from './select-account/select-account.component';
import { CongratsComponent } from './congrats/congrats.component';
import { DailougeBoxComponent } from './dailouge-box/dailouge-box.component';
import { PackagesComponent } from './packages/packages.component';
import { TrainingComponent } from './training/training.component';
import { WorkCompleteComponent } from './work-complete/work-complete.component';
import { GetOrderComponent } from './get-order/get-order.component';
import { ArviedComponent } from './arvied/arvied.component';
import { StartWorkComponent } from './start-work/start-work.component';
import { WorkOtpComponent } from './work-otp/work-otp.component';
import { VerifyAfterWorkComponent } from './verify-after-work/verify-after-work.component';
import { SubServicesComponent } from './sub-services/sub-services.component';
import { MapBoxComponent } from './map-box/map-box.component';


// fire base


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { environment } from '../environments/environment';
import { NotFoundComponent } from './not-found/not-found.component';
import { KeysPipe } from './keys.pipe';
import { LocationComponent } from './location/location.component';
import { DailogeBoxService } from './dailoge-box.service';


import { NgxLoadingModule } from "ngx-loading";
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { WorkImageComponent } from './work-image/work-image.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ServiceComponent } from './service/service.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LanguageComponent,
    LogInComponent,
    VerifyComponent,
    AboutUserComponent,
    SelectWorkComponent,
    AboutWorkComponent,
    WorkExperianceComponent,
    AadharVerificationComponent,
    PancardComponent,
    BankDetailsComponent,
    HomeComponent,
    FotterComponent,
    CreditComponent,
    MenuComponent,
    VisitingCardComponent,
    ReferAndEarnComponent,
    AwardsComponent,
    HelpsComponent,
    TargetComponent,
    EarningsComponent,
    WaitingPageComponent,
    NotificationComponent,
    CalenderComponent,
    JobHistoryComponent,
    AddCreditComponent,
    FinancialDetailsComponent,
    JobDetailsComponent,
    IdentityVerificationComponent,
    OngoingComponent,
    DemoComponent,
    InductionComponent,
    StartComponent,
    SelectAccountComponent,
    CongratsComponent,
    DailougeBoxComponent,
    PackagesComponent,
    TrainingComponent,
    WorkCompleteComponent,
    GetOrderComponent,
    ArviedComponent,
    StartWorkComponent,
    WorkOtpComponent,
    VerifyAfterWorkComponent,
    SubServicesComponent,
    MapBoxComponent,
    NotFoundComponent,
    KeysPipe,
    LocationComponent,
    ManageServicesComponent,
    WorkImageComponent,
    FeedbackComponent,
    ServiceComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatInputModule,
    
    MatCardModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDialogModule,
    MatSlideToggleModule,
    RoundProgressModule,
    MatDatepickerModule ,
    MatNativeDateModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    NgxLoadingModule
  ],
  providers: [
    provideAnimationsAsync(),DailogeBoxService
  ],
  bootstrap: [AppComponent],
 
})
export class AppModule { }
