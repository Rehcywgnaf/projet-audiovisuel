import '@testing-library/jest-dom';

global.window.fs = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
};

afterEach(() => {
  jest.clearAllMocks();
});