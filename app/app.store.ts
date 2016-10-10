import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {State, Store} from 'walts'

import {AppDispatcher} from './app.dispatcher'
import {ViewName} from './app.routing'
import {ModalDialogParams, ModalDialogType} from './modal-dialog.component'
import {ProjectsRepository} from './projects.repository'

export class AppState extends State {
  currentView?: ViewName
  modalDialog?: ModalDialogParams
  projects?: ProjectsRepository
}

const INIT_STATE: AppState = {
  currentView: void 0,
  modalDialog: {
    type: void 0,
    isVisible: false
  },
  projects: void 0
}

@Injectable()
export class AppStore extends Store<AppState> {

  constructor(protected dispatcher: AppDispatcher,
              private projectsRepository: ProjectsRepository) {
    super((() => {
      INIT_STATE.projects = projectsRepository
      return INIT_STATE
    })(), dispatcher)
  }

  get allProjects$(): Observable<any> {
    return this.projectsRepository.all$
  }

  getModalDialogIsVisible(): Observable<boolean> {
    return this.observable.map((st) => {
      return st.modalDialog.isVisible
    })
  }

  getModalDialogType(): Observable<ModalDialogType> {
    return this.observable.map((st) => {
      return st.modalDialog.type
    })
  }
}
