export interface MoodleCourse {
  id: number;
  fullname: string;
  shortname: string;
  idnumber: string;
  summary: string;
  summaryformat: number;
  startdate: number;
  enddate: number;
  visible: boolean;
  fullnamedisplay: string;
  viewurl: string;
  courseimage: string;
  progress: number;
  hasprogress: boolean;
  isfavourite: boolean;
  hidden: boolean;
  showshortname: boolean;
  coursecategory: string;
}

export interface MoodleApiResponse {
  index: number;
  methodname: string;
  args: {
    offset: number;
    limit: number;
    classification: string;
    sort: string;
    customfieldname: string;
    customfieldvalue: string;
  };
}

export interface MoodleCoursesResponse {
  error: false;
  data: {
    courses: MoodleCourse[];
    nextoffset: number;
  };
}

export interface CourseContentModule {
  name: string;
  modname: string;
  instance: number;
  viewurl: string;
  availablefrom?: number;
  availableuntil?: number;
  lockdownoptions?: any[];
  visible?: boolean;
  stealth?: boolean;
  deletable?: boolean;
  courseid?: number;
  sectionnumber?: number;
  subsectionnumber?: number;
  completion?: number;
}

export interface CourseSection {
  sectionnumber: number;
  name: string;
  summary: string;
  modules?: CourseContentModule[];
}
