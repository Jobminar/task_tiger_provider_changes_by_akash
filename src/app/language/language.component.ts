import { Component ,Input} from '@angular/core';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrl: './language.component.css'
})
export class LanguageComponent {

  constructor(private router:Router)
  {

  }

  Language:any=[
    {languages:'English',isChecked: false },
    {languages:'हिंदी',isChecked: false },
    {languages:'తెలుగు',isChecked: false},
    {languages:'ಕನ್ನಡ',isChecked: false}, 
    {languages:'اردو',isChecked: false},
  ]
  toggleCheckbox(item: any) {

   if (item.isChecked) {
    item.isChecked=false
   }
   else{
    item.isChecked=true
   }
  }
  selectOnlyOne(selectedItem:any) {
    this.Language.forEach((item: { isChecked: boolean; }) => {
      item.isChecked = false;
    });
    selectedItem.isChecked = true;
    console.log(selectedItem.languages);
  }

  submit(){
    this.router.navigate(['log-in']);
  }
 
}
