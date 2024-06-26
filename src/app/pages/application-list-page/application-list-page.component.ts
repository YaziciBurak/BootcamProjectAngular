import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { formatDate1 } from '../../core/helpers/format-date';
import { ApplicantListItemDto } from '../../features/models/responses/applicant/applicant-list-item-dto';
import { ApplicationListItemDto } from '../../features/models/responses/application/application-list-item-dto';
import { ApplicationService } from '../../features/services/concretes/application.service';
import { initFlowbite } from 'flowbite';
import { PageRequest } from '../../core/models/page-request';
import { DynamicQuery } from '../../core/models/dynamic-query';
import { AuthService } from '../../features/services/concretes/auth.service';

@Component({
  selector: 'app-application-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SharedModule],
  templateUrl: './application-list-page.component.html',
  styleUrl: './application-list-page.component.css',
})
export class ApplicationListPageComponent implements OnInit {
  activeFilter: 'all' | 'accepted' | 'rejected' | 'waiting' = 'all';
  formDate = formatDate1;
  dateNow = Date.now;
  currentPageNumber: number = 0;
  applicationList: ApplicationListItemDto = {
    index: 0,
    size: 0,
    count: 0,
    hasNext: false,
    hasPrevious: false,
    pages: 0,
    items: [],
  };
  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private activatedRoute: ActivatedRoute
  ) { }
  readonly PAGE_SIZE = 6;
  ngOnInit(): void {
    this.getAllApplications({ pageIndex: 0, pageSize: this.PAGE_SIZE });
  }
  getList(pageRequest: PageRequest) {
    this.applicationService.getList(pageRequest).subscribe((response) => {
      this.applicationList = response;
    });
  }

  setCurrentPageNumber(pageNumber: number): void {
    this.currentPageNumber = pageNumber - 1;
    const pageRequest = {
      pageIndex: this.currentPageNumber,
      pageSize: this.PAGE_SIZE,
    };
    switch (this.activeFilter) {
      case 'all':
        this.getAllApplications(pageRequest);
        break;
      case 'accepted':
        this.getAcceptedApplications(pageRequest);
        break;
      case 'rejected':
        this.getRejectedApplications(pageRequest);
        break;
      case 'waiting':
        this.getWaitingApplications(pageRequest);
        break;
    }
  }

  getAllApplications(pageRequest: PageRequest): void {
    this.activeFilter = 'all';
    const loggedInUserId = this.authService.getCurrentUserId();
    const query: DynamicQuery = {
      filter: {
        field: 'applicantId',
        operator: 'eq',
        value: loggedInUserId.toString(),
      },
    };
    this.applicationService
      .getListApplicationByDynamic(pageRequest, query)
      .subscribe((response) => {
        this.applicationList = response;
      });
  }

  getAcceptedApplications(pageRequest: PageRequest): void {
    this.activeFilter = 'accepted';
    const loggedInUserId = this.authService.getCurrentUserId();
    const query: DynamicQuery = {
      filter: {
        field: 'applicantId',
        operator: 'eq',
        value: loggedInUserId.toString(),
        logic: 'and',
        filters: [
          {
            field: 'applicationStateId',
            operator: 'eq',
            value: '2',
          },
        ],
      },
    };
    this.applicationService
      .getListApplicationByDynamic(pageRequest, query)
      .subscribe((response) => {
        this.applicationList = response;
      });
  }

  getRejectedApplications(pageRequest: PageRequest): void {
    this.activeFilter = 'rejected';
    const loggedInUserId = this.authService.getCurrentUserId();
    const query: DynamicQuery = {
      filter: {
        field: 'applicantId',
        operator: 'eq',
        value: loggedInUserId.toString(),
        logic: 'and',
        filters: [
          {
            field: 'applicationStateId',
            operator: 'eq',
            value: '3',
          },
        ],
      },
    };
    this.applicationService
      .getListApplicationByDynamic(pageRequest, query)
      .subscribe((response) => {
        this.applicationList = response;
      });
  }

  getWaitingApplications(pageRequest: PageRequest): void {
    this.activeFilter = 'waiting';
    const loggedInUserId = this.authService.getCurrentUserId();
    const query: DynamicQuery = {
      filter: {
        field: 'applicantId',
        operator: 'eq',
        value: loggedInUserId.toString(),
        logic: 'and',
        filters: [
          {
            field: 'applicationStateId',
            operator: 'eq',
            value: '1',
          },
        ],
      },
    };
    this.applicationService
      .getListApplicationByDynamic(pageRequest, query)
      .subscribe((response) => {
        this.applicationList = response;
      });
  }

  getPageNumbers(): number[] {
    const pageNumbers = [];
    for (let i = 0; i < this.applicationList.pages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
  onPageNumberClicked(pageNumber: number): void {
    console.log(`Page number clicked: ${pageNumber}`);
    const pageRequest = { pageIndex: pageNumber, pageSize: this.PAGE_SIZE };
    switch (this.activeFilter) {
      case 'all':
        this.getAllApplications(pageRequest);
        break;
      case 'accepted':
        this.getAcceptedApplications(pageRequest);
        break;
      case 'rejected':
        this.getRejectedApplications(pageRequest);
        break;
      case 'waiting':
        this.getWaitingApplications(pageRequest);
        break;
    }
  }
}
