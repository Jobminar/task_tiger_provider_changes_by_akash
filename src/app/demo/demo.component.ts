import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogData } from '../../models/dialogData';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  
  @Input() content: string = '';

  constructor(
    public dialogRef: MatDialogRef<DemoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData
  ) {
    this.content = data.content;

    // Automatically close the dialog after 3 seconds
    setTimeout(() => {
      this.onNoClick();
    }, 3000);
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog
  }
}