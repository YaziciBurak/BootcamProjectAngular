export interface GetlistBootcampcontentResponse {
    id: number,
    bootcampId: number,
    bootcampName: string,
    videoUrl: string,
    content: string,
    hasApplicantBootcampContent?: boolean,
    ifApplicantPassed?: boolean

}
