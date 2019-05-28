import { NiceBoolPipe } from './nice-bool.pipe';

describe('NiceBoolPipe', () => {
  it('create an instance', () => {
    const pipe = new NiceBoolPipe();
    expect(pipe).toBeTruthy();
  });
});
