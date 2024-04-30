import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GetlistInstructorResponse } from '../../models/responses/instructor/getlist-instructor-response'; 
import { InstructorService } from '../../services/concretes/instructor.service';
import { SharedModule } from "../../../shared/shared.module";
import { InstructorListItemDto } from '../../models/responses/instructor/instructor-list-item-dto';


@Component({
    selector: 'app-instructor',
    standalone: true,
    templateUrl: './instructor.component.html',
    styleUrl: './instructor.component.css',
    imports: [FormsModule, CommonModule, RouterModule, SharedModule]
})
export class InstructorComponent implements OnInit{

  @Input() selectedInstructorId:string; 
  @Output() instructorSelected = new EventEmitter<string>(); 
  instructors!:InstructorListItemDto;
  currentInstructor!:GetlistInstructorResponse;
  filterText="";
  constructor(private instructorService:InstructorService){}
  
  
  ngOnInit(): void {
    this.getInstructors();
    console.log(this.instructorSelected)
  }

  onSelectedInstructor(instructorId:string):void{
    this.selectedInstructorId=instructorId;
    this.instructorSelected.emit(this.selectedInstructorId);
  }

  getInstructors(){
     this.instructorService.getListAll().subscribe((response)=>{
      this.instructors=response;
     })
  }

  setCurrentInstructor(instructor:GetlistInstructorResponse){
    this.currentInstructor=instructor;
  }

  getCurrentInstructorClass(instructor:GetlistInstructorResponse){
    if(instructor==this.currentInstructor){
      return "list-group-item active"
    }else{
     return "list-group-item"
    }
  }

  getDefaultInstructorClass(){
    if(!this.currentInstructor){
      return "list-group-item list-group-item-info"
    }else{
      return "list-group-item"
    }
  }
}
