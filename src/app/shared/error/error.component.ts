import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  @Input() errorMsg:string = null;
  @Input() isError:boolean ;

  @Output() remove = new EventEmitter<void>();
  
  constructor() { }

  ngOnInit(): void {
  }

  emitRemove(){
    this.remove.emit();
  }


}
