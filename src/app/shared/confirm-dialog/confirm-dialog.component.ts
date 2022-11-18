import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  @Input() message:string;

  constructor(private ngbActiveModal : NgbActiveModal) { }

  ngOnInit(): void {
  }

  onCloseModal(choice:boolean){
    this.ngbActiveModal.close(choice);
  }

}
