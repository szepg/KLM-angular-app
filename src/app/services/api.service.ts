import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/w/api.php';

  constructor(private http: HttpClient) {}

  getData(searchText: string, continueToken?: string, offset?: number, showItemsNumber?: number,): Observable<any> {
    const params: any = {
        action: 'query',
        format: 'json',
        list: 'search',
        utf8: '',
        formatversion: '2',
        srsearch: searchText ? searchText : ' ',
        srprop: 'sectiontitle|sectionsnippet|snippet|timestamp',
        // srlimit: showItemsNumber,
      };

      // if (showItemsNumber) {
      //   params['srlimit'] = showItemsNumber;
      // }

      if (continueToken){
        params['continue'] = continueToken;
        params['sroffset'] = offset;
      }

      return this.http.get<any>(this.apiUrl, { params });
  }

}