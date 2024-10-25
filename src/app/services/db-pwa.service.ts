import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

@Injectable({
  providedIn: 'root',
})
export class DbPwaService {
  private db: any;

  constructor() {
    this.db = new PouchDB('sinConexion');
  }

  guardarCancelacionKit(id: any) {
    return this.db.put({
      _id: `cancelarKit-${id}`,
      type: 'cancelarKit',
      id: id,
      timestamp: new Date().toISOString()
    }).catch((error: any) => {
      console.error('Error al guardar la cancelación de kit', error);
    });
  }

  eliminarCancelacionKit(id: any) {
    return this.db.get(`cancelarKit-${id}`).then((doc: any) => {
      return this.db.remove(doc);
    }).catch((error: any) => {
      console.error('Error al eliminar la cancelación de kit', error);
    });
  }

  obtenerCancelacionesPendientes() {
    return this.db.find({
      selector: { type: 'cancelarKit' }
    }).then((result: any) => {
      return result.docs;
    });
  }
}
