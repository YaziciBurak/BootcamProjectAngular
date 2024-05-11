import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BootcampBaseService } from '../abstracts/bootcamp-base.service';
import { GetbyidBootcampResponse } from '../../models/responses/bootcamp/getbyid-bootcamp-response';
import { environment } from '../../../../environments/environment.development';
import { BootcampListItemDto } from '../../models/responses/bootcamp/bootcamp-list-item-dto';
import { PageRequest } from '../../../core/models/page-request';
import { DeleteBootcampResponse } from '../../models/responses/bootcamp/delete-bootcamp-response';
import { UpdateBootcampRequest } from '../../models/requests/bootcamp/update-bootcamp-request';
import { UpdateBootcampResponse } from '../../models/responses/bootcamp/update-bootcamp-response';
import { CreateBootcampRequest } from '../../models/requests/bootcamp/create-bootcamp-request';
import { CreateBootcampResponse } from '../../models/responses/bootcamp/create-bootcamp-response';

@Injectable({
  providedIn: 'root'
})
export class BootcampService extends BootcampBaseService {
  private readonly apiUrl:string = `${environment.API_URL}/bootcamps`

  constructor(private httpClient: HttpClient) { super(); }
  
  override getList(pageRequest: PageRequest): Observable<BootcampListItemDto> {
    const newRequest: {[key: string]: string | number} = {
      pageIndex: pageRequest.page,
      pageSize: pageRequest.pageSize
    };
    return this.httpClient.get<BootcampListItemDto>(this.apiUrl,{
      params:newRequest
    }).pipe(
      map((response)=>{
        const newResponse:BootcampListItemDto={
          index:pageRequest.page,
          size:pageRequest.pageSize,
          count:response.count,
          hasNext:response.hasNext,
          hasPrevious:response.hasPrevious,
          items:response.items,
          pages:response.pages
        };
        return newResponse;
      })
    )
  }

  delete(id: number): Observable<DeleteBootcampResponse> {
    return this.httpClient.delete<DeleteBootcampResponse>( `${this.apiUrl}/`+ id);
  }

  update(bootcamp: UpdateBootcampRequest): Observable<UpdateBootcampResponse> {
    return this.httpClient.put<UpdateBootcampResponse>(`${this.apiUrl}`, bootcamp);
  }

  create(bootcamp: CreateBootcampRequest): Observable<CreateBootcampResponse> {
    return this.httpClient.post<CreateBootcampResponse>(`${this.apiUrl}`, bootcamp);
  }

  override getById(bootcampId: number): Observable<GetbyidBootcampResponse> {
    const newRequest: {[key: string]: string | number} = {
      id: bootcampId
    };
    return this.httpClient.get<GetbyidBootcampResponse>(`${this.apiUrl}/${bootcampId}`, {
      params: newRequest
    }).pipe(
      map((response) => {
        const newResponse: GetbyidBootcampResponse = {
          id: response.id,
          name: response.name,
          instructorId: response.instructorId,
          instructorFirstName: response.instructorFirstName,
          instructorLastName: response.instructorLastName,
          bootcampStateId: response.bootcampStateId,
          bootcampStateName: response.bootcampStateName,
          bootcampImageId: response.bootcampImageId,
          bootcampImagePath: response.bootcampImagePath,
          detail: response.detail,
          deadline: response.deadline,
          startDate: response.startDate,
          endDate: response.endDate
        };
        return newResponse;
      })
    );
  }
  
override getListBootcampByInstructorId(pageRequest:PageRequest,instructorId: string): Observable<BootcampListItemDto> {
  const newRequest :{[key:string]:string | number}={
    instructorId:instructorId,
    page:pageRequest.page,
    pageSize:pageRequest.pageSize
};
return this.httpClient.get<BootcampListItemDto>(`${this.apiUrl}/getbootcampbyinstructorid?${instructorId}`,{
  params:newRequest
}).pipe(
  map((response)=>{
    const newResponse:BootcampListItemDto={
      index:pageRequest.page,
      size:pageRequest.pageSize,
      count:response.count,
      hasNext:response.hasNext,
      hasPrevious:response.hasPrevious,
      items:response.items,
      pages:response.pages
    };
    return newResponse; 
  })
)
}}
