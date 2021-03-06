import {Injectable} from '@angular/core';
import {GLOBAL_URL} from '../../shared/constant/url.constant';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../../core/auth/auth.service';
import {Url} from '../../shared/models/url.model';
import {PageModel} from '../../shared/models/page-model.model';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private rootUrl: string = GLOBAL_URL + '/api';
  private url: string = GLOBAL_URL + '/api/url';

  constructor(private http: HttpClient, protected authService: AuthService,) {
  }

  findAll(options: HttpParams): Observable<HttpResponse<PageModel<Url>>> {
    console.log(this.authService.getCurrentToken());
    return this.http.get<PageModel<Url>>(this.url, {
      params: options,
      headers: {Authorization: `Bearer ${this.authService.getCurrentToken()}`},
      observe: 'response'
    });
  }

  getUrlByShortCut(shortCut: string): Observable<HttpResponse<Url>> {
    return this.http.get<Url>(this.rootUrl + '/getUrlByShortCut/' + shortCut, {
      observe: 'response'
    });
  }

  save(options: Url): Observable<HttpResponse<Url>> {
    return this.http.post<Url>(this.url, options,
      {
        headers: {Authorization: `Bearer ${this.authService.getCurrentToken()}`},
        observe: 'response'
      });
  }
}
