import { ForbiddenException, Injectable } from '@nestjs/common';
import { CloudUser } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { IsNull, Not, Repository } from 'typeorm';
import { AuthDto } from './dto';
import { Tokens } from './types';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CloudUser)
    private userRepository: Repository<CloudUser>, 

    private jwtService: JwtService,
  ){}

  async signup(dto: AuthDto): Promise<Tokens> {
    const passwordHash = await this.hashData(dto.password)

    const userInfo = this.userRepository.create({
      email: dto.email,
      passwordHash
    })

    const newUser = await this.userRepository.save(userInfo)

    const tokens = await this.getToken(newUser.id, newUser.email)
    await this.updateRtHash(newUser.id, tokens.refresh_token)
    return tokens
  }

  async signin(dto: AuthDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where:{
        email: dto.email
      }  
    })

    if(!user) throw new ForbiddenException("Access Denied")

    // 유저한테 받은값하고 db값하고 비교해야함 == 원본 비번을 저장할 필요없음
    const passwordMatches = bcrypt.compare(dto.password, user.passwordHash)

    if(!passwordMatches) throw new ForbiddenException("Access Denied")

    const tokens = await this.getToken(user.id, user.email);
    // await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens.access_token;
  }

  async logout(userId: number) {
    await this.userRepository.update(
      {id: userId, hashedRt: Not(IsNull()) },
      { hashedRt: null }
    )

    return true
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getToken(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }


  async updateRtHash(userId:number, rt: string){
    const hash = await this.hashData(rt)
    await this.userRepository.update(
      { id: userId },
      { hashedRt: hash }
    )
  }


    // 토큰에 넣고싶은 정보 정리 민감한 데이터 x
    async getToken(userId:number, email:  string): Promise<Tokens> {
      const [at, rt] = await Promise.all([
        
        this.jwtService.signAsync({
          sub: userId,
          email,
          role: 'ROLES'
        },{
          secret: 'at-secret',
          expiresIn: 60 * 15
        }),
  
        this.jwtService.signAsync({
          sub: userId,
          email
        },{
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7
        }),
  
      ])
  
      return {
        access_token: at,
        refresh_token: rt
      }
    }

  hashData(data: string){
    return bcrypt.hash(data, 10)
  }

}
