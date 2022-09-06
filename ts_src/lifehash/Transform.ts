export class Transform {
  public transpose: boolean;
  public reflect_x: boolean;
  public reflect_y: boolean;

  constructor(transpose: boolean, reflect_x: boolean, reflect_y: boolean) {
    this.transpose = transpose;
    this.reflect_x = reflect_x;
    this.reflect_y = reflect_y;
  }
}
