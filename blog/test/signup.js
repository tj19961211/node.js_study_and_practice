const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = require('../index')
const UserModel = require('../models/users')

const testName1 = 'nihao'
const testName2 = 'dsadsad'

describe('signup', function(){
    describe('POST /signup', function () {
        const agent = request.agent(app)  // persist cookie when redirect 重定向时保留cookie
        beforeEach(function (done) {
            //创建一个用户
            UserModel.create({
                name: testName1,
                password: '123456',
                bio: ''
            })
            .then(function () {
                done()
            })
            .catch(done)
        })

        afterEach(function (done) {
            // 删除测试用户
            UserModel.destroy({ name: { $in: [testName1, testName2] } })
              .exec()
              .then(function () {
                done()
              })
              .catch(done)
          })


        after(function (done) {
            process.exit()
        })

        // 用户名错误的情况
        it('wrong name', function (done) {
            agent
            .post('/signup')
            .type('form')
            .field({ name: '' })
            .redirects()
            .end(function (err, res) {
                if (err) return done(err)
                assert(res.text.match(/名字请限制在 1-10 个字符/))
                done()
            })
        })


        // 其余的参数测试自行补充
        // 用户名被占用的情况
        it('duplicate name', function (done) {
            agent
            .post('/signup')
            .type('form')
            .field({ name: testName1, bio: '', password: '123456', repassword: '123456' })
            .redirects()
            .end(function (err, res) {
                if (err) return done(err)
                assert(res.text.match(/用户名已被占用/))
                done()
            })

            // 注册成功的情况
        it('success', function (done) {
            agent
            .post('/signup')
            .type('form')
            .field({ name: testName2, bio: '', password: '123456', repassword: '123456' })
            .redirects()
            .end(function (err, res) {
                if (err) return done(err)
                assert(res.text.match(/注册成功/))
                done()
            })
        })
        })
        })
})