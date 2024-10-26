import { AfterViewInit, Component ,Input} from '@angular/core';
import { Router  } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrl: './language.component.css'
})
export class LanguageComponent implements AfterViewInit{

  // constructor(private router:Router)
  // {

  // }

  // Language:any=[
  //   {languages:'English',isChecked: false },
  //   {languages:'हिंदी',isChecked: false },
  //   {languages:'తెలుగు',isChecked: false},
  //   {languages:'ಕನ್ನಡ',isChecked: false}, 
  //   {languages:'اردو',isChecked: false},
  // ]
  // toggleCheckbox(item: any) {

  //  if (item.isChecked) {
  //   item.isChecked=false
  //  }
  //  else{
  //   item.isChecked=true
  //  }
  // }
  // selectOnlyOne(selectedItem:any) {
  //   this.Language.forEach((item: { isChecked: boolean; }) => {
  //     item.isChecked = false;
  //   });
  //   selectedItem.isChecked = true;
  //   console.log(selectedItem.languages);
  // }

  // submit(){
  //   this.router.navigate(['log-in']);
  // }
 

  constructor(private readonly location:Location){

  }
  ngAfterViewInit() {
    this.loadGoogleTranslateScript();
  }
  loadGoogleTranslateScript() {
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.id = 'google-translate-script';
      document.body.appendChild(script);
    }
  }
  navToBack(){
    this.location.back();   
  }
}
