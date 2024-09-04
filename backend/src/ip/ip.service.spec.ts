import { Test, TestingModule } from '@nestjs/testing';
import { IpService } from './ip.service';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('geoip-lite', () => ({
  lookup: jest.fn(),
}));

describe('IpService', () => {
  let service: IpService;
  const geoip = require('geoip-lite');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpService],
    }).compile();

    service = module.get<IpService>(IpService);
  });

  it('should return country code for a valid IP', async () => {
    const mockGeo = { country: 'US' };
    (geoip.lookup as jest.Mock).mockReturnValue(mockGeo);

    const result = await service.getCountryCodeFromIp('8.8.8.8');
    expect(result).toBe('US');
  });

  it('should return server error for invalid IP', async () => {
    (geoip.lookup as jest.Mock).mockReturnValue(null);

    await expect(service.getCountryCodeFromIp('x.x.x.x')).rejects.toThrow(new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR));
  });
});
