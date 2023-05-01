const audio = document.querySelector('.audio')
const nameSong = document.querySelector('.header h2')
const playBtn = document.querySelector('.fa-play')
const pauseBtn = document.querySelector('.fa-pause')
const cd = document.querySelector('.cd')
const progress = document.querySelector('.line')
const nextBtn = document.querySelector('.fa-forward-step')
const backBtn = document.querySelector('.fa-backward-step')
const randomBtn = document.querySelector('.fa-shuffle')
const reloadBtn = document.querySelector('.fa-rotate-right')
const playList = document.querySelector('.play-list')

const app = {
    currentIndex: 0,

    isPlaying: false,

    isRandom: false, 

    isReload: false,

    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/nevada.mp3',
            img: './assets/image/nevada.png'
        },

        {
            name: 'The Way I Still Love You',
            singer: 'Reynard Silva',
            path: './assets/music/the-way-i-still-love-you.mp3',
            img: './assets/image/thewayistillloveyou.png'
        },

        {
            name: 'Ocean',
            singer: 'Mike Perry',
            path: './assets/music/ocean.mp3',
            img: './assets/image/ocean.png'
        },

        {
            name: 'Đường Tôi Chở Em Về',
            singer: 'Buitruonglinh',
            path: './assets/music/duongtoichoemve.mp3',
            img: './assets/image/duongtoichoemve.jpg'
        },

        {
            name: 'Love Is Gone',
            singer: 'SLANDER',
            path: './assets/music/loveisgone.mp3',
            img: './assets/image/loveisgone.jpg'
        },

        {
            name: 'Monster',
            singer: 'Katie Sky',
            path: './assets/music/monster.mp3',
            img: './assets/image/monster.jpg'
        },

        {
            name: 'Thắc Mắc',
            singer: 'Thịnh Suy',
            path: './assets/music/thacmac.mp3',
            img: './assets/image/thacmac.jpg'
        },

        {
            name: 'Ngủ Một Mình',
            singer: 'Hieuthuhai',
            path: './assets/music/ngumotminh.mp3',
            img: './assets/image/ngumotminh.jpg'
        },

        {
            name: 'Unity',
            singer: 'Alan Walker',
            path: './assets/music/unity.mp3',
            img: './assets/image/unity.jpg'
        },

        {
            name: 'The Nights',
            singer: 'Acivii',
            path: './assets/music/thenight.mp3',
            img: './assets/image/thenight.jpg'
        },
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${app.currentIndex == index ? 'active' : ''}" data-index="${index}">
                    <div class="song-img" style="background-image: url(${song.img});"></div>
                    <div class="song-content">
                        <h3>${song.name}</h3>
                        <p>${song.singer}</p>
                    </div>
                </div>
            `
        })

        document.querySelector('.play-list').innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function () {
        // Xử lí cuộn màn hình
        const cdHeight = cd.offsetHeight
        document.onscroll = function () {
            const scrollY = document.documentElement.scrollTop || window.screenY
            const newHeight = cdHeight - scrollY

            cd.style.height = newHeight > 0 ? newHeight + 'px' : 0
            cd.style.width = newHeight > 0 ? newHeight + 'px' : 0
            cd.style.opacity = newHeight/cdHeight
        }

        // Xử lí quoay CD
        const cdRotate = cd.animate(
            [
                {transform: "rotate(360deg)"}
            ],
            {
                duration: 10000,
                iterations: Infinity
            }
        )
        cdRotate.pause()

        // Xử lý nhấn nút play
        playBtn.onclick = function () {
            playBtn.style.display = 'none'
            pauseBtn.style.display = 'block'
            audio.play()
            cdRotate.play()
            app.isPlaying = true
        }

        // Xử lý nhấn nút pause
        pauseBtn.onclick = function () {
            pauseBtn.style.display = 'none'
            playBtn.style.display = 'block'
            audio.pause()
            cdRotate.pause()
            app.isPlaying = false
        }

        // Xứ lý khi thời gian bài hát thay đổi
        audio.ontimeupdate = function () {
            progress.value = Math.floor( audio.currentTime / audio.duration * 100)
        }

        // Xử lý khi tua bài hát
        progress.onchange = function (e) {
            audio.currentTime = e.target.value * audio.duration /100
        }

        // Xử lí khi next bài hát
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.currentIndex++
                if (app.currentIndex >= app.songs.length) {
                    app.currentIndex = 0
                }
            }
            app.loadCurrentSong()
            if (app.isPlaying) audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lí khi back bài hát
        backBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.currentIndex--
                if (app.currentIndex < 0)
                    app.currentIndex = app.songs.length - 1
            }
            app.loadCurrentSong()
            if (app.isPlaying) audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lí khi kết thúc bài hát
        audio.onended = function () {
            if (app.isReload) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lí khi nhấn shuffle bài hát
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }        

        // Xử lí khi nhấn reload bài hát
        reloadBtn.onclick = function () {
            app.isReload = !app.isReload
            reloadBtn.classList.toggle('active', app.isReload)
        }

        // Xử lí khi nhấn chọn tên bài hát
        playList.onclick = function (e) {
            const newSong = e.target.closest('.song:not(.active)')
            app.currentIndex = newSong.dataset.index
            app.render()
            app.loadCurrentSong()
            if (app.isPlaying)
                audio.play()
            else
                audio.pause()
        }
    },

    scrollToActiveSong: function () {
        const activeSong = document.querySelector('.song.active')
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * (app.songs.length))
        } while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
    },

    loadCurrentSong: function () {
        nameSong.textContent = this.currentSong.name
        cd.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },

    start: function () {
        this.defineProperties()
        this.handleEvent()
        this.render()
        this.loadCurrentSong()
    }
}

app.start()