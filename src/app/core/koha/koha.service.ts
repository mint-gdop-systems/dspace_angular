import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface KohaItem {
  id: string;
  title: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  year?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class KohaService {
  private kohaBaseUrl = '';

  constructor(private http: HttpClient) {}

  searchKohaItems(query: string = '', limit: number = 10): Observable<KohaItem[]> {
    return this.authenticate().pipe(
      switchMap(token => {
        if (!token) return of([]);
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        });
        
        console.log('KohaService: Fetching biblios...');
        return this.http.get<any[]>(`http://localhost:3001/api/v1/biblios?_per_page=${limit}`, { headers }).pipe(
          map(biblios => {
            console.log('KohaService: Received biblios:', biblios.length, 'items');
            return this.mapKohaBiblios(biblios, query);
          }),
          catchError(error => {
            console.error('KohaService: Biblios fetch failed:', error);
            return of([]);
          })
        );
      })
    );
  }

  getRecentKohaItems(limit: number = 10): Observable<KohaItem[]> {
    return this.searchKohaItems('', limit);
  }

  private authenticate(): Observable<string | null> {
    console.log('KohaService: Authenticating...');
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', '0d7136be-4bee-4086-b36a-22f1d89600a0');
    body.set('client_secret', 'd022ced0-f36f-41bd-8f47-a9a367c451ca');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    return this.http.post<any>('http://localhost:3001/api/v1/oauth/token', body.toString(), { headers }).pipe(
      map(response => {
        console.log('KohaService: Authentication successful, token:', response.access_token?.substring(0, 20) + '...');
        return response.access_token;
      }),
      catchError(error => {
        console.error('KohaService: Authentication failed:', error);
        return of(null);
      })
    );
  }

  private mapKohaBiblios(biblios: any[], query?: string): KohaItem[] {
    let filteredBiblios = biblios;
    
    if (query) {
      filteredBiblios = biblios.filter(biblio => 
        (biblio.title && biblio.title.toLowerCase().includes(query.toLowerCase())) ||
        (biblio.author && biblio.author.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    return filteredBiblios.map(biblio => ({
      id: biblio.biblio_id.toString(),
      title: biblio.title || 'Untitled',
      author: biblio.author || '',
      publisher: biblio.publisher || '',
      year: biblio.copyright_date?.toString() || biblio.publication_year?.toString() || '',
      isbn: biblio.isbn || '',
      url: `http://127.0.0.1:8085/cgi-bin/koha/catalogue/detail.pl?biblionumber=${biblio.biblio_id}`
    }));
  }


}