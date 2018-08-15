import {Observable} from "rxjs/internal/Observable";

export interface Service<E> {


  url: string;

  findAll(): Observable<E[]>
  findById(id: string): Observable<E>
  save(e: E): Observable<E>
  update(e: E): Observable<E>
  delete(id: string)
  search(e: {}): Observable<E[]>

}
