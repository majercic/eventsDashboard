import { Test, TestingModule } from '@nestjs/testing';
import { AdCheckService } from './ad-check.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AdCheckService', () => {
  let service: AdCheckService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdCheckService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'API_URI':
                  return 'http://mock-api.com';
                case 'API_USERNAME':
                  return 'mockUser';
                case 'API_PASSWORD':
                  return 'mockPassword';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AdCheckService>(AdCheckService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return false if country code is US', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        ads: 'you shall not pass!',
      },
    });

    const result = await service.isCountryAllowed('US');
    expect(result).toBe(false);
  });

  it('should return true if country code is SI', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        ads: 'sure, why not!',
      },
    });

    const result = await service.isCountryAllowed('SI');
    expect(result).toBe(true);
  });

  it('should return bad requst if there are missing parameters', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 400,
      },
    });

    expect(service.isCountryAllowed('SI')).rejects.toThrow(new HttpException('Bad Request - missing mandatory parameters', HttpStatus.BAD_REQUEST));
  })

  it('should return unauthorized if credentials are invalid', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    expect(service.isCountryAllowed('SI')).rejects.toThrow(new HttpException('Unauthorized - invalid credentials', HttpStatus.UNAUTHORIZED));
  });

  it('should return server error if server is temporarily unavailable', async () => {
    for (let i = 0; i <= 3; i++) {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 500,
        },
      });
    }

    expect(service.isCountryAllowed('SI')).rejects.toThrow(new HttpException('Server Error - server is temporarily not available', HttpStatus.INTERNAL_SERVER_ERROR));
  });
});