import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CreateQuizResponse } from '../../features/models/responses/quiz/create-quiz-response';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BootcampContentPageComponent } from '../bootcamp-content-page/bootcamp-content-page.component';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FinishQuizRequest } from '../../features/models/requests/quiz/finish-quiz-request';
import { QuizService } from '../../features/services/concretes/quiz.service';
import { PassedResultComponent } from '../../shared/components/passed-result/passed-result.component';
import { NotpassedResultComponent } from '../../shared/components/notpassed-result/notpassed-result.component';
import { FinishQuizResponse } from '../../features/models/responses/quiz/finish-quiz-response';
import { CertificateService } from '../../features/services/concretes/certificate.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [CommonModule, BootcampContentPageComponent, RouterModule, FormsModule, ReactiveFormsModule, PassedResultComponent, NotpassedResultComponent],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.css'
})
export class QuizPageComponent implements OnInit {
  createdQuiz: CreateQuizResponse | null = null;
  questions: CreateQuizResponse['questionResponses'];
  timer: string = "01:00";
  isPassed: boolean | null = null;
  score: number;
  newQuiz: CreateQuizResponse;
  questionResults: Record<number, FinishQuizResponse['questionResults'][0]>;
  @ViewChild('resultForm', { static: false }) resultForm: NgForm;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private certificateService: CertificateService,
    private toastr: ToastrService

  ) {

    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.replaceUrl) {
      this.router.navigate(["/homepage"]);
    }

    if (!navigation?.extras?.state?.['quiz']) {
      return;
    }
    this.createdQuiz = navigation.extras.state['quiz'];
    this.questions = this.createdQuiz.questionResponses;
    console.log(this.questions);

  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.startTimer(1 * 60 - 1);
  }


  startTimer(duration: number): void {

    let t = duration;
    const intervalId = setInterval(() => {
      let minutes = parseInt(String(t / 60), 10);
      let seconds = parseInt(String(t % 60), 10);


      minutes = minutes < 10 ? 0 + minutes : minutes;
      seconds = seconds < 10 ? 0 + seconds : seconds;


      this.timer = minutes + ":" + seconds;

      if (--t < 0) {

        clearInterval(intervalId);
        this.finishQuiz(this.resultForm);
      }
    }, 1000);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    event.preventDefault();
  }

  finishQuiz(resultForm: NgForm): void {
    // Formdaki cevapları al
    const formValues = resultForm.value;
    console.log(resultForm.valid, formValues);

    // finishQuiz metodu için request oluştur
    const request: FinishQuizRequest = {
      quizId: this.createdQuiz.id, // formdaki quizId
      answers: {} // Cevapları saklamak için boş bir obje
    };

    // Her bir soru için cevapları request objesine ekle
    Object.keys(formValues).forEach(key => {
      if (key.startsWith('question_')) {
        const questionId = parseInt(key.split('_')[1], 10);
        request.answers[questionId] = formValues[key];
      }
    });

    console.log("request", request);

    // finishQuiz metodunu çağır ve request'i gönder
    this.quizService.finishQuiz(request).subscribe(
      response => {
        console.log('Quiz successfully finished:', response);
        this.score = response.score;
        this.questionResults = {};
        response.questionResults.forEach(question => {
          this.questionResults[question.id] = question;
        });
        this.isPassed = response.result.isPassed;
        window.scrollTo(0, 0);
        //window.removeEventListener('beforeunload', this.beforeUnloadHandler);

      },
      error => {
        console.error('Error finishing quiz:', error);
      }
    );
  }

  createCertificate(): void {
    this.certificateService.create({
      applicantId: this.createdQuiz.applicantId,
      bootcampId: this.createdQuiz.bootcampId
    }).subscribe(
      response => {
        console.log(response);

        // sertifikayı indir
        // burada DOM'da bir <a></a> elementi yaratıp
        // click ettiriyoruz ki dosya insin
        const url = window.URL.createObjectURL(response.content);
        const a = document.createElement("a");
        a.href = url;
        a.download = response.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toastr.success("Sertifikanız başarıyla oluşturuldu.");
        // 1 sn sonra anasayfaya yönlendir
        setTimeout(() => {
          this.router.navigate(["/homepage"]);
        }, 1000);
      },
      error => {
        this.toastr.error('Sertifika oluşturma sırasında hata oluştu');
      }

    );
  }

  retakeQuiz(id: number): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.quizService.getExam(id).subscribe(
      response => {
        console.log("new quiz", response);

        this.router.navigate([`/quiz/${response.id}`], { state: { quiz: response } }).then(() => {

          this.router.routeReuseStrategy.shouldReuseRoute = (future, curr) => future.routeConfig === curr.routeConfig;
        });
      },
      error => {
        this.toastr.error('Quiz oluşturma sırasında hata oluştu');
      }
    );
  }

}


