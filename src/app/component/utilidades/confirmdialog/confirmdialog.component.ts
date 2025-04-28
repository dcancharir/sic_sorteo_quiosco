import { Component, OnInit } from '@angular/core';
import { ConfirmdialogService } from '../../../service/confirmdialog/confirmdialog.service';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css'],
})
export class ConfirmdialogComponent implements OnInit {
  message: any;
  constructor(private confirmDialogService: ConfirmdialogService) {}

  ngOnInit(): any {
    /**
     *   This function waits for a message from alert service, it gets
     *   triggered when we call this from any other component
     */
    this.confirmDialogService.getMessage().subscribe((message) => {
      this.message = message;
    });
  }
}
