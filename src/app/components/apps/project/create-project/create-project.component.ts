import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-create-project',
    templateUrl: './create-project.component.html',
    styleUrls: ['./create-project.component.scss'],
    standalone: false
})
export class CreateProjectComponent implements OnInit {

  files: File[] = [];
	startingDate: NgbDateStruct;
	endingDate: NgbDateStruct;

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  constructor() { }

  ngOnInit() {
  }

}
