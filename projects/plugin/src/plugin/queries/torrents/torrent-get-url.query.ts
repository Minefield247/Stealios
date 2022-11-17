import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProviderHttpService } from '../../services/provider-http.service';
import { getDomainFromUrl } from '@wako-app/mobile-sdk';

export class TorrentGetUrlQuery {
  static getData(url: string, subPageUrl?: string, attempt = 0): Observable<string> {
    if (!subPageUrl) {
      return of(url);
    }

    return ProviderHttpService.request<string>(
      {
        method: 'GET',
        url: subPageUrl,
        responseType: 'text'
      },
      '1d',
      10000,
      true
    ).pipe(
      catchError((err) => {
        if (err && err.status === 503 && attempt === 0) {
          attempt++;

          return timer(1000).pipe(
            switchMap(() => {
              return this.getData(url, subPageUrl, attempt);
            })
          );
        }
        return of(null);
      }),
      map((_html) => {
        if (!_html) {
          return null;
        }

        if (_html.match(/>([a-zA-Z0-9]{40})</)) {
          const infoHash = _html.match(/>([a-zA-Z0-9]{40})</)[1];
          return 'magnet:?xt=urn:btih:'+infoHash;
        }
        return null;
      })
    );
  }
}
