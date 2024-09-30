import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dialogData } from '../models/dialogData';
import { DemoComponent } from './demo/demo.component';
@Injectable({
  providedIn: 'root'
})
export class DailogeBoxService {

  constructor(private dialog: MatDialog) {}

  openDialog(content: string) {
    const dialogData: dialogData = { content };

    this.dialog.open(DemoComponent, {
      width: '100%',
      height: 'auto',
      panelClass: 'bottom-dialog-container',
      data: dialogData, // Pass data here
    });
  }
}
