import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dailouge-box',
  templateUrl: './dailouge-box.component.html',
  styleUrl: './dailouge-box.component.css'
})
export class DailougeBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<DailougeBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.data.services);
  }
}
