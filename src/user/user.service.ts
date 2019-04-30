import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

  async validateUser(payload: JwtPayload): Promise<any> {
    // put some validation logic here
    // for example query user by id/email/username
    return {};
  }

  public async logIn(loginDto: LoginDto) {
    const user = await this.findByEmailAndPassword(loginDto);

    return await this._proceedWithLogIn(user);
  }

  private async _proceedWithLogIn(loginDto: LoginDto) {
    const user: JwtPayload = { email: loginDto.email};
    const accessToken = this.jwtService.sign(user);
    this.updateToken(accessToken, loginDto.email)
    return {
      email: loginDto.email,
      accessToken,
    };
  }

  updateToken(accessToken: string, email: string): Promise<any>{
      try {
          return new Promise<any> ((resolve, reject) => {
          this.findByEmail(email)
          .then((currentUser: User) => {
                  try {
                      if (currentUser == null) reject('Not existing')
                      let user = currentUser;
                      user.token=accessToken;
                      this.userRepository.save(user)
                      .then(response => resolve(response))
                      .catch(err => reject(err))
                  }
                  catch(e) {
                          reject(e)
                  }
              })
              .catch(err => reject(err))
              }) 
      } catch (error) {
          console.error("failed")
      }
  }

    // 指定されたEメールアドレスのユーザを検索する
    findByEmail(_email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.userRepository.findOne({ email: _email })
                .then((user: User) => {
                    resolve(user);
                });
        });
    }

    findByToken(_token: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.userRepository.findOne({ token: _token })
                .then((user: User) => {
                    resolve(user);
                });
        });
    }

    add(user: User): Promise<User> {
        this.findByEmail(user.email)
        .then((currentUser: User) => {
            if (currentUser !== undefined) {
                return currentUser;
            }
            else {
                return new Promise((resolve, reject) => {
                    if (currentUser === undefined) {

                        user.password = this.getPasswordHash(user.password);

                        this.userRepository.save<User>(user)
                        .then((result: User) => {
                            resolve(result);
                        })
                        .catch((err: any) => {
                            reject(err);
                        });
                    }
                });
            }
        })
        .catch((err: any) => {
             throw err;
        });
        return undefined;
    }

    // パスワードをハッシュ化する
    private getPasswordHash(_password: String) {
        const saltRounds: number = 10;
        const salt: string = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(_password, salt);
    }

    private matchPassword (
      hashedPassword: string,
      plainTextPassword: string,
    ) {
      return bcrypt.compare(plainTextPassword, hashedPassword);
    };

    async findByEmailAndPassword(loginDto: LoginDto) {
        const result = await this.findByEmail(loginDto.email)
        .then((currentUser: User) => {
            return new Promise(async (resolve, reject) => {
                if (currentUser === undefined) {
                    reject("failed");
                } else {
                    const passwordDoesMatch = await this.matchPassword(currentUser.password, loginDto.password);
                    console.log(passwordDoesMatch);
                    if(!passwordDoesMatch) {
                        reject("failed");
                    }
                    resolve("success");
                }
            });
        }).catch(err => {
            console.error('login failed', err);
        });
        if(result==="success") {
          return loginDto;
        } else {
          return undefined;
        }
    }
}