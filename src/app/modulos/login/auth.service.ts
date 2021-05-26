//import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DoCheck, Injectable } from '@angular/core';

//import { AngularFireAuth } from '@angular/fire/auth';
import { HttpService } from '../../http/httpServices/http.service'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import { auth } from 'firebase/app';
import { environment } from '../../../environments/environment'
//import firebase from '@firebase/app';

export interface User {
  uid: string;
  username: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

}
