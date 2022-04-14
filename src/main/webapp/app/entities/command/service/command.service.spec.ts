import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICommand, Command } from '../command.model';

import { CommandService } from './command.service';

describe('Command Service', () => {
  let service: CommandService;
  let httpMock: HttpTestingController;
  let elemDefault: ICommand;
  let expectedResult: ICommand | ICommand[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CommandService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      addressC: 'AAAAAAA',
      dateC: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Command', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Command()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Command', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          addressC: 'BBBBBB',
          dateC: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Command', () => {
      const patchObject = Object.assign({}, new Command());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Command', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          addressC: 'BBBBBB',
          dateC: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Command', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCommandToCollectionIfMissing', () => {
      it('should add a Command to an empty array', () => {
        const command: ICommand = { id: 123 };
        expectedResult = service.addCommandToCollectionIfMissing([], command);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(command);
      });

      it('should not add a Command to an array that contains it', () => {
        const command: ICommand = { id: 123 };
        const commandCollection: ICommand[] = [
          {
            ...command,
          },
          { id: 456 },
        ];
        expectedResult = service.addCommandToCollectionIfMissing(commandCollection, command);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Command to an array that doesn't contain it", () => {
        const command: ICommand = { id: 123 };
        const commandCollection: ICommand[] = [{ id: 456 }];
        expectedResult = service.addCommandToCollectionIfMissing(commandCollection, command);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(command);
      });

      it('should add only unique Command to an array', () => {
        const commandArray: ICommand[] = [{ id: 123 }, { id: 456 }, { id: 50224 }];
        const commandCollection: ICommand[] = [{ id: 123 }];
        expectedResult = service.addCommandToCollectionIfMissing(commandCollection, ...commandArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const command: ICommand = { id: 123 };
        const command2: ICommand = { id: 456 };
        expectedResult = service.addCommandToCollectionIfMissing([], command, command2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(command);
        expect(expectedResult).toContain(command2);
      });

      it('should accept null and undefined values', () => {
        const command: ICommand = { id: 123 };
        expectedResult = service.addCommandToCollectionIfMissing([], null, command, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(command);
      });

      it('should return initial array if no Command is added', () => {
        const commandCollection: ICommand[] = [{ id: 123 }];
        expectedResult = service.addCommandToCollectionIfMissing(commandCollection, undefined, null);
        expect(expectedResult).toEqual(commandCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
