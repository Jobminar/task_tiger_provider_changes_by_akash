import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { StartComponent } from './start/start.component';
import { SelectAccountComponent } from './select-account/select-account.component';
import { CongratsComponent } from './congrats/congrats.component';
import { PackagesComponent } from './packages/packages.component';
import { TrainingComponent } from './training/training.component';
import { GetOrderComponent } from './get-order/get-order.component';
import { ArviedComponent } from './arvied/arvied.component';
import { StartWorkComponent } from './start-work/start-work.component';
import { WorkOtpComponent } from './work-otp/work-otp.component';
import { WorkCompleteComponent } from './work-complete/work-complete.component';
import { VerifyAfterWorkComponent } from './verify-after-work/verify-after-work.component';
import { SubServicesComponent } from './sub-services/sub-services.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LocationComponent } from './location/location.component';
import { HelpModule } from './help/help.module';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { WorkImageComponent } from './work-image/work-image.component';
import { ServiceComponent } from './service/service.component';


const routes: Routes = [
  {path:'',component:LandingPageComponent},
  {path:'language',component:LanguageComponent},
  {path:'log-in',component:LogInComponent},
  {path:'location',component:LocationComponent},
  {path:'verify',component:VerifyComponent},
  {path:'aboutUser',component:AboutUserComponent},
  {path:'selectWork',component:SelectWorkComponent},
  {path:'aboutWork',component:AboutWorkComponent},
  {path:'workExperiance',component:WorkExperianceComponent},
  {path:'aadharVerify',component:AadharVerificationComponent},
  {path:'pancard',component:PancardComponent},
  {path:'bankDetails',component:BankDetailsComponent},
  {path:'waiting',component:WaitingPageComponent},
  {path:'home',component:HomeComponent},
  {path:'fotter',component:FotterComponent},
  {path:'credits',component:CreditComponent},
  {path:'notification',component:NotificationComponent},
  {path:'menu',component:MenuComponent},
  {path:'visitingCard',component:VisitingCardComponent},
  {path:'referAndEarn',component:ReferAndEarnComponent},
  {path:'awards',component:AwardsComponent},
  // {path:'help',component:HelpsComponent},
  {path:'help',loadChildren:() => import ('../app/help/help.module').then(m  => m.HelpModule)},
  {path:'target',component:TargetComponent},
  {path:'earnings',component:EarningsComponent},
  {path:'calender',component:CalenderComponent},
  {path:'jobHistory',component:JobHistoryComponent},
  {path:'jobDetails',component:JobDetailsComponent},
  {path:'addCredit',component:AddCreditComponent},
  {path:'financialDetails',component:FinancialDetailsComponent},
  {path:'identityVerification',component:IdentityVerificationComponent},
  {path:'ongoing',component:OngoingComponent},
  {path:'demo',component:DemoComponent},
  {path:'induction',component:InductionComponent},
  {path:'started',component:StartComponent},
  {path:'selectAccount',component:SelectAccountComponent},
  {path:'congrats',component:CongratsComponent},
  {path:'packages',component:PackagesComponent},
  {path:'training',component:TrainingComponent},
  {path:'getOrder/:id',component:GetOrderComponent},
  {path:'arrived/:id',component:ArviedComponent},
  {path:'startWork/:id',component:StartWorkComponent},
  {path:'work/otp/:id',component:WorkOtpComponent},
  {path:'completeWork/:id',component:WorkCompleteComponent},
  {path:'verifyAfterWork/:id',component:VerifyAfterWorkComponent},
  {path:'subServices',component:SubServicesComponent},
  {path:'notFound',component:NotFoundComponent},
  {path:'manageServices',component:ManageServicesComponent},
  {path:'feedback',component:FeedbackComponent},
  {path:'workImage/:id',component:WorkImageComponent},
  {path:'services',component:ServiceComponent}
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
