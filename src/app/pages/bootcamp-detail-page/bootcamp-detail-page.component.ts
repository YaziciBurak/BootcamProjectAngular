import { Component, OnInit } from '@angular/core';
import { GetbyidBootcampResponse } from '../../features/models/responses/bootcamp/getbyid-bootcamp-response';
import { BootcampService } from '../../features/services/concretes/bootcamp.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { formatDate, formatDate1 } from '../../core/helpers/format-date';
import { ApplicationService } from '../../features/services/concretes/application.service';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';

@Component({
  selector: 'app-bootcamp-detail-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './bootcamp-detail-page.component.html',
  styleUrl: './bootcamp-detail-page.component.css',
})
export class BootcampDetailPageComponent implements OnInit {
  getByIdBootcampResponse !: GetbyidBootcampResponse;
  bootcampId: number = 1;
  bootcampDetail: SafeHtml;
  formatDate = formatDate1;

  constructor(
    private bootcampService: BootcampService,
    private activatedRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    private sanitizer: DomSanitizer,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.activatedRoute.params.subscribe((params: { [x: string]: number; }) => {
      if (params["bootcampId"]) {
        this.getBootcampById(params["bootcampId"])
      }
    })
  }
  getBootcampById(bootcampId: number): void {
    this.bootcampService.getById(bootcampId).subscribe(
      (response: GetbyidBootcampResponse) => {
        this.getByIdBootcampResponse = response;
        this.bootcampDetail = this.sanitizer.bypassSecurityTrustHtml(response.detail);
        console.log(this.bootcampDetail);
      },
      (error: any) => {
        this.toastr.error('Error fetching bootcamp:', error);
      }
    );
  }
  applyForBootcamp(id: number): void {
    this.applicationService.applyForBootcamp(id).subscribe(response => {
      this.toastr.success("Başvurunuz alınmıştır, teşekkürler!")
    }, 
      () => {
        this.toastr.error('Bu bootcampe başvurdunuz. Tekrar başvuramazsınız.');
      });
      setTimeout(() => {
        window.location.reload();
      }, 6000);
  }

  isDeadlinePassed(deadline: Date): boolean {
    return new Date(deadline) < new Date();
  }

}
