// ==UserScript==
// @name          ELO
// @namespace     https://github.com/Mart-0
// @description   ELO made for speed
// @author        Mart Groothuis
// @license       MIT

// @downloadURL   https://github.com/Mart-0/ELO/raw/master/elo.user.js
// @updateURL     https://github.com/Mart-0/ELO/raw/master/elo.user.js
// @supportURL    https://github.com/Mart-0/ELO/issues
// @version       1.0.0

// @match         https://elo.windesheim.nl/*
// @grant         none
// @run-at        document-start
// @require       https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// @noframes
// ==/UserScript==

'use strict'

// add your own image link!
const backgroundImage = ''

const path = location.pathname.toLowerCase().split('?')[0].replace(/^\/+|\/+$/g, '').split('/')[0]

// filter for other pages like login
if (['security', 'cms', 'services'].indexOf(path) >= 0) return

// clear /Start.aspx
if (location.pathname === '/Start.aspx') {
    location.pathname = ''
    location.hash = ''
}

// vue application
const App = {
    template: String.raw`
        <div class="bg-image" @mouseleave="stopSliding" @mouseup="stopSliding">
            <div class="flex h-screen antialiased text-gray-800 overflow-hidden">
        
                <!-- sidebar -->
                <div class="flex">
        
                    <!-- courses list -->
                    <div class="flex flex-row bg-white dark:bg-gray-700">
                        <div ref="coursesBar" :style="{'width': coursesBarWidth + 'px'}"
                            class="flex flex-col justify-start items-start p-3 flex-wrap select-none overflow-hidden overflow-x-auto items-center flex-shrink-0 w-20 bg-gradient-to-b from-gray-800 to-gray-700 dark:bg-gray-900">
        
                            <button aria-label="toggle favorites" @click="toggleShowFavoriteCourses"
                                class="flex shadow-xl items-center justify-center m-1 bg-gray-600 hover:bg-gray-500 hover-bg-gray-500 focus:outline-none focus:bg-gray-400 focus-outline-none focus-bg-gray-400 rounded-full h-12 w-12 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                    :fill="showFavoriteCourses ? '#fff' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </button>
        
                            <ul class="p-1" v-for="course in shownCourses" :key="course.ID">
                                <li @click="clickCourse(course)">
                                    <div class="flex items-center">
                                        <span :class="[getColor(course.ID)]"
                                            class="flex shadow-xl items-center justify-center font-semibold h-12 w-12 rounded-2xl hover:rounded-xl hover-rounded-xl transform ease-in-out transition-all duration-300">
                                            {{ course.ALIAS }}
                                        </span>
                                    </div>
                                </li>
                            </ul>
        
                        </div>
                    </div>
        
                    <!-- file viewer -->
                    <div class="flex flex-row bg-white dark:bg-gray-700" :class="{'border-r': selectedCourseVisable}">
                        <div ref='fileViewer' class="w-full flex flex-col m-3 mr-0"
                            :class="{'ml-0': !showSelectedCourse, 'transition-all duration-300': !isMouseDown}"
                            :style="{'width': fileViewerWidth + 'px' }">
                            <div v-if="selectedCourseVisable"
                                class="w-full shadow-sm rounded-lg p-2 bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white overflow-auto">
        
                                <!-- course info and favorite toggle -->
                                <div class="flex justify-between items-center">
                                    <h1 class="text-2xl font-semibold text-gray-600 m-2 mt-1 whitespace-nowrap truncate">
                                        {{ selectedCourse.NAME }}
                                    </h1>
        
                                    <div class="flex">
                                        <svg @click="toggleFavorite(selectedCourse)" xmlns="http://www.w3.org/2000/svg"
                                            class="h-6 w-6 text-gray-600 mx-1 cursor-pointer"
                                            :fill="selectedCourse.IS_FAVORITE ? '#4b5563' : 'none'" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                </div>
        
                                <!-- content list -->
                                <div class="select-none" v-if="shownContent" v-for="content in shownContent" :key="content.ID">
                                    <div class="cursor-pointer" @click="selectContent(selectedCourse, content)">
                                        <div :class="[  content.LEVEL === 1 ? 'ml-2' : '', content.LEVEL === 2 ? 'ml-4' : '',content.LEVEL === 3 ? 'ml-6' : '']"
                                            class="flex items-center justify-between p-2 rounded hover:bg-gray-300 hover-bg-gray-300">
                                            <div class="flex justify-between items-center w-full">
                                                <div class="overflow-hidden flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5" style="min-width: 20px"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                            :d="getIconPath(content)" />
                                                    </svg>
        
                                                    <a @click.prevent class="ml-2 text-sm truncate"
                                                        :href="content.URL">{{ content.NAME }}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <!-- slideBar -->
                        <div :class="{'w-0' : !showSelectedCourse, 'w-3' : showSelectedCourse}"
                            class="transition-all duration-300" style="cursor: col-resize" @mousedown="startSliding"></div>
                    </div>
                </div>
        
                <div class="flex flex-col h-full w-full select-none overflow-hidden">
                    <!-- top bar -->
                    <div class="h-11 p-0.5 p-0-5 flex flex justify-between border-b bg-white">
                        <div class="flex w-full">
        
                            <!-- file viewer toggle -->
                            <button v-if="selectedCourse" aria-label="toggle content list"
                                @click="showSelectedCourse = !showSelectedCourse"
                                class="m-0.5 m-0-5 p-1 w-9 px-2 rounded bg-gray-100 hover:bg-gray-200 hover-bg-gray-200 focus:outline-none focus:bg-gray-300 focus-outline-none focus-bg-gray-300 flex items-center">
        
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
        
                            <!-- contentTab -->
                            <div class="flex w-full overflow-hidden">
                                <div v-if="selectedContent?.NAME"
                                    class="m-0.5 m-0-5 p-1 flex-grow max-w-xs pl-2 pr-1 rounded bg-gray-100 flex justify-between items-center whitespace-nowrap">
                                    <div class="flex flex-col">
        
                                        <a @click.prevent ref="tab" style="width: 275px" class="mr-2 truncate"
                                            :href="selectedContent?.URL">{{ selectedContent?.NAME }}</a>
                                        <!-- <span class="text-xs text-gray-500">PLAYING</span> -->
                                    </div>
        
                                    <button aria-label="close content" @click="clearURL()"
                                        class="hover:bg-gray-200 hover-bg-gray-200 focus:outline-none focus:bg-gray-300 focus-outline-none focus-bg-gray-300 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 m-1" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <!-- main content -->
                    <main class="flex h-full shadow-3xl-inner">
                        <div class="flex w-full" v-if="selectedContent">
                            <span class="bg-white m-4 p-2 h-10 rounded" v-if="selectedContent?.TYPE === 'upload'">Inleveren word
                                niet ondersteund</span>
                            <iframe title="content" class="bg-white" :class="{'pointer-events-none' : isMouseDown}"
                                v-if="selectedContent?.ITEMTYPE !== 9" :src="selectedContent?.URL" width="100%" height="100%">
                            </iframe>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            activeSession: true,
            showFavoriteCourses: localStorage.getItem('showFavoriteCourses') === 'false' ? false : true,
            showSelectedCourse: false,
            selectedCourseVisable: false,
            selectedCourse: null,
            selectedContent: null,
            courses: [],
            URLIds: [],
            mousePosition: { x: 0, y: 0 },
            isMouseDown: false,
            currentOpenWidth: Number(localStorage.getItem('currentWidth')) || 300,
            coursesBarWidth: 80,
            startWidth: 0,
            startMouse: 0,
            distanceWidth: 0,
        }
    },

    computed: {
        // show the correct ammount of ccourses
        shownCourses() {
            if (this.showFavoriteCourses) return this.courses.filter((c) => c.IS_FAVORITE === true)
            return this.courses
        },
        // only show content where the parent has HIDECHILDEREN off
        shownContent() {
            let content = this.selectedCourse.CONTENT

            return content.filter(c => {
                let parent = content.find(p => p.ID === c.PARENTID)

                if (parent?.HIDECHILDEREN) return false
                return true
            })
        },
        // get the width of the file viewer
        fileViewerWidth() {
            if (this.showSelectedCourse) return this.currentOpenWidth
            else return 0
        }
    },

    watch: {
        // add a delay to accommodate the animation
        showSelectedCourse: function () {
            if (this.showSelectedCourse) return this.selectedCourseVisable = true
            setTimeout(() => this.selectedCourseVisable = false, 200)
        },

        // calculate the courses bar width if showFavoriteCourses changes
        showFavoriteCourses: function () {
            this.calculateCoursesBarWidth()
        }
    },

    // start of application
    async created() {
        document.addEventListener('mousemove', this.mouseMoved)

        this.checkAuth()
        await this.getCourses()
        this.calculateCoursesBarWidth()
        this.readURL()
    },

    methods: {
        // start sliding the width of the sidebar
        startSliding(e) {
            e.preventDefault()

            this.isMouseDown = true
            this.startWidth = this.fileViewerWidth

            this.startMouse = e.clientX
        },

        // stop sliding the width of the sidebar
        stopSliding(e) {
            e.preventDefault()

            this.isMouseDown = false
        },

        // the mouse has moved
        mouseMoved(e) {
            e.preventDefault()

            this.mousePosition.x = e.clientX
            this.mousePosition.y = e.clientY

            if (!this.isMouseDown) return

            this.distanceWidth = (this.mousePosition.x - this.startMouse) + this.startWidth

            // constraints
            if (this.distanceWidth > window.innerWidth - 200) this.distanceWidth = window.innerWidth - 200
            if (this.distanceWidth < 150) this.distanceWidth = 150

            requestAnimationFrame(this.updateFileViewerWidth)
        },

        // calculate the needed width for the courses bar
        calculateCoursesBarWidth() {
            this.coursesBarWidth = 80;

            this.$nextTick(() => {
                this.coursesBarWidth = this.$refs.coursesBar ? this.$refs.coursesBar?.scrollWidth : 80
            })
        },

        // update the width of the sidebar
        updateFileViewerWidth() {
            this.currentOpenWidth = this.distanceWidth
            localStorage.setItem('currentWidth', this.currentOpenWidth)
        },

        // get the colors based on the id
        getColor(id) {
            return colorStrings[id.toString().slice(-1)]
        },

        // get the correct icon path for each content type
        getIconPath(content) {
            if (content.ITEMTYPE === 0) return icons[this.getContentType(content)]
            return icons[content.TYPE]
        },

        // get the content type
        getContentType(content) {
            if (content.ITEMTYPE === 0 && content.HIDECHILDEREN) return 'folder'
            if (content.ITEMTYPE === 0 && !content.HIDECHILDEREN) return 'openFolder'
            if (content.ITEMTYPE === 3 && this.isLink(content)) return 'link'
            if (content.ITEMTYPE === 3 || (content.ITEMTYPE === 10 && ['mp4'].indexOf(content?.URL.split('.').pop()) >= 0)) return 'video'
            if (content.ITEMTYPE === 10 && ['doc', 'docx', 'dotx', 'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'sql'].indexOf(content?.URL.split('.').pop()) >= 0) return 'downloadFile'
            if (content.ITEMTYPE === 10 && ['zip', 'rar'].indexOf(content?.URL.split('.').pop()) >= 0) return 'downloadFolder'
            if (content.ITEMTYPE === 10 && ['jpg', 'jpeg', 'png', 'gif', 'bmp'].indexOf(content?.URL.split('.').pop()) >= 0) return 'image'
            if (content.ITEMTYPE === 11) return 'book'
            if (content.ITEMTYPE === 9) return 'upload'

            return 'file'
        },

        // check is countent is a link some items that have: content.OPEN_IN_NEW_WINDOW can vbe opened in a iframe
        isLink(content) {
            try {
                return window.location.hostname.split('.')[1] !== (new URL(content.URL)).hostname.split('.')[1]
            } catch (e) {
                console.warn(`invalid URL error: ${e}`)
            }
        },

        // set the url 
        setURL(content = null) {
            if (!history.pushState) return
            let newURL = ''

            if (this.selectedCourse !== null) this.URLIds[0] = this.selectedCourse.ID
            if (content !== null) {
                this.URLIds[content.LEVEL + 1] = content.ID.toString()
                this.URLIds.slice(0, content.LEVEL - 2)
                this.URLIds = this.URLIds.slice(0, content.LEVEL + 2)
            }

            if (this.URLIds !== null) newURL += `/#${this.URLIds.join('/')}`

            if (newURL !== window.location.href && content.ITEMTYPE !== 0) {
                history.replaceState({ title: newURL }, newURL, newURL)
            }
        },

        // removes dulpicate objects from arrays nessesery for the file browser
        removeDuplicateObjectFromArray(arr) {
            return arr.reduce((filter, current) => {
                if (!filter.find(item => item.ID === current.ID)) return filter.concat([current])
                return filter
            }, [])
        },

        // clear the content
        clearURL() {
            this.selectedContent = null
            history.replaceState({ title: '' }, '', '/')
        },

        // close all content from a course
        closeAll(content) {
            content.forEach((item) => item.HIDECHILDEREN = true)
            return content
        },

        // close all childeren of a specified folder
        closeAllChilderen(course, content) {
            let childerenReached = false

            course?.CONTENT.forEach(item => {
                if (item.LEVEL === content.LEVEL) childerenReached = false
                if (item.ID === content.ID) childerenReached = true
                if (childerenReached === true) item.HIDECHILDEREN = true
            });
        },

        // select content from the file viewer
        selectContent(course, content) {
            // itemtype 0 is a folder 
            if (content.ITEMTYPE === 0) {
                this.getCoursesContent(course, content.ID)
                content.HIDECHILDEREN = !content.HIDECHILDEREN

                if (content.HIDECHILDEREN) this.closeAllChilderen(course, content)
            } else {
                if (this.isLink(content)) return window.open(content.URL)
                this.selectedContent = content
            }

            this.setURL(content)
        },

        // toggle the showing of favorite courses
        toggleShowFavoriteCourses() {
            this.showFavoriteCourses = !this.showFavoriteCourses
            localStorage.setItem('showFavoriteCourses', this.showFavoriteCourses)
        },

        // async functions
        // click a course
        async clickCourse(course) {
            await this.selectCourse(course)
            this.showSelectedCourse = true
        },

        // select a course
        async selectCourse(course) {
            this.selectedCourse = course
            await this.getCoursesContent(course)
            this.closeAll(course?.CONTENT)
        },

        // view an incoming url and load the correct content
        async readURL() {
            let ids = window.location.hash.substring(1).split('/')

            let course = this.courses.find(course => course.ID == ids[0])
            if (course !== undefined) await this.selectCourse(course)

            ids.shift()

            for (const id of ids) {
                content = course?.CONTENT.find(item => item.ID == id)
                await this.selectContent(course, content)
            }
        },

        // toggle the favorite staus of an course
        async toggleFavorite(selectedCourse) {
            await this.fetchAPI('/Home/StudyRoute/StudyRoute/ToggleFavorite', {
                studyrouteId: selectedCourse.ID
            }, 'POST').then(r => {
                if (r?.success === true) selectedCourse.IS_FAVORITE = !selectedCourse.IS_FAVORITE
            })
        },

        // check if the user is loged in
        async checkAuth() {
            await this.fetchAPI('/services/Mobile.asmx/LoadUserSchoolConfig').then((data) => {
                if (data.ACTIVESESSION) return this.activeSession = true
                this.activeSession = false

                window.location.replace(`/Security/SAML2/Login.aspx?redirectUrl=${encodeURIComponent(location.href)} `)
            })
        },

        // get the courses
        async getCourses() {
            await this.cacheAPI('/services/Studyroutemobile.asmx/LoadStudyroutes', {
                start: 0,
                length: 100,
                filter: 0,
                search: ''
            }).then(data => {
                if (data?.STUDYROUTES.length == 0) return

                let courses = data?.STUDYROUTES

                if (!courses) return

                // create the alliasses
                courses.map(course => {
                    // check abbreviations
                    let a = abbreviations?.[course.ID]

                    // delete lowecase spaces - and shorten to 4 max
                    if (a === undefined) a = course.NAME.replace(/[a-z -]+/g, '').slice(0, 4)

                    // else get first 2 cars of name
                    if (a === '') a = `${course.NAME.replace(/[ ]+/g, '').slice(0, 2).toUpperCase()} ${course.NAME.replace(/[a-zA-Z -]+/g, '')} `

                    course.ALIAS = a
                    course.CONTENT = []
                })

                this.courses = courses
            })
        },

        // get the content from an course
        async getCoursesContent(course, parentid = -1) {
            await this.cacheAPI('/services/Studyroutemobile.asmx/LoadStudyrouteContent', {
                studyrouteid: course.ID,
                parentid: parentid,
                start: 0,
                length: 100
            }).then(({ STUDYROUTE_CONTENT }) => {
                const parent = course.CONTENT.find(item => item.ID === parentid)
                const index = course.CONTENT.findIndex(item => item.ID === parentid)
                const level = index === -1 ? 0 : parent?.LEVEL + 1

                STUDYROUTE_CONTENT.forEach(c => c.LEVEL = level)
                STUDYROUTE_CONTENT.forEach(c => (c.ITEMTYPE === 0) && (c.HIDECHILDEREN = true))
                STUDYROUTE_CONTENT.forEach(c => c.TYPE = this.getContentType(c))

                let content = [...course.CONTENT.slice(0, index + Math.min(level, 1)), ...STUDYROUTE_CONTENT, ...course.CONTENT]

                course.CONTENT = this.removeDuplicateObjectFromArray(content)
            })
        },

        // same as fetchAPI but with a cache
        async cacheAPI(url = '', data = {}, method = 'GET') {
            let URLWithPara = url

            if (Object.entries(data).length > 0 && method === 'GET') URLWithPara += '?' + (new URLSearchParams(data)).toString()

            try {
                if (method === 'GET' && JSON.parse(localStorage.getItem(URLWithPara)) !== null && JSON.parse(localStorage.getItem(url)) !== undefined) {
                    this.fetchAPI(url, data, method)
                    return JSON.parse(localStorage.getItem(URLWithPara))
                }
            } catch (e) {
                console.warn(`JSON parse error: ${e} `)
            }

            return await this.fetchAPI(url, data, method);
        },

        // fetch a resource
        async fetchAPI(url = '', data = {}, method = 'GET') {
            const options = {
                method: method, // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            }

            if (Object.entries(data).length > 0 && method === 'GET') url += '?' + (new URLSearchParams(data)).toString()

            if (Object.entries(data).length > 0 && method !== 'GET') {
                options.headers = { 'Content-Type': 'application/json' }
                options.body = JSON.stringify(data) // body data type must match "Content-Type" header     
            }

            return await fetch(url, options)
                .then(res => {
                    // get content-type
                    const contentType = res.headers.get("content-type")

                    // parses JSON response into native JavaScript objects only if JSON
                    if (contentType && contentType.indexOf("application/json") !== -1) return res.json()
                    else window.location.replace(`/Security/SAML2/Login.aspx?redirectUrl=${encodeURIComponent(location.href)} `)
                })
                .then(json => {
                    localStorage.setItem(url, JSON.stringify(json))

                    return json
                })
                .catch(e => console.warn(`fetch error: ${e} `))
        }
    }
}

// styling
const style = `

   *,::after,::before{box-sizing:border-box}html{-moz-tab-size:4;-o-tab-size:4;tab-size:4}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}body{font-family:system-ui, -apple-system,'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'}hr{height:0;color:inherit}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}table{text-indent:0;border-color:inherit}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type='button'],button{-webkit-appearance:button}legend{padding:0}progress{vertical-align:baseline}[type='search']{-webkit-appearance:textfield;outline-offset:-2px}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}button{background-color:transparent;background-image:none}fieldset{margin:0;padding:0}ol,ul{list-style:none;margin:0;padding:0}html{font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";line-height:1.5}body{font-family:inherit;line-height:inherit}*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:currentColor}hr{border-top-width:1px}img{border-style:solid}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder,textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button{cursor:pointer}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,optgroup,select,textarea{padding:0;line-height:inherit;color:inherit}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}*,::after,::before{--tw-border-opacity:1;border-color:rgba(229, 231, 235, var(--tw-border-opacity))}.pointer-events-none{pointer-events:none}.static{position:static}.m-0{margin:0}.m-1{margin:0.25rem}.m-2{margin:0.5rem}.m-3{margin:0.75rem}.m-4{margin:1rem}.m-0-5{margin:0.125rem}.mx-1{margin-left:0.25rem;margin-right:0.25rem}.mt-1{margin-top:0.25rem}.mr-0{margin-right:0}.mr-2{margin-right:0.5rem}.ml-0{margin-left:0}.ml-2{margin-left:0.5rem}.ml-4{margin-left:1rem}.ml-6{margin-left:1.5rem}.flex{display:flex}.table{display:table}.h-4{height:1rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-10{height:2.5rem}.h-11{height:2.75rem}.h-12{height:3rem}.h-full{height:100%}.h-screen{height:100vh}.w-0{width:0}.w-3{width:0.75rem}.w-4{width:1rem}.w-6{width:1.5rem}.w-9{width:2.25rem}.w-12{width:3rem}.w-20{width:5rem}.w-full{width:100%}.max-w-xs{max-width:20rem}.flex-shrink-0{flex-shrink:0}.flex-grow{flex-grow:1}.transform{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@-webkit-keyframes spin{to{transform:rotate(360deg)}}@keyframes spin{to{transform:rotate(360deg)}}@-webkit-keyframes ping{100%,75%{transform:scale(2);opacity:0}}@keyframes ping{100%,75%{transform:scale(2);opacity:0}}@-webkit-keyframes pulse{50%{opacity:0.5}}@keyframes pulse{50%{opacity:0.5}}@-webkit-keyframes bounce{0%,100%{transform:translateY(-25%);-webkit-animation-timing-function:cubic-bezier(0.8,0,1,1);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;-webkit-animation-timing-function:cubic-bezier(0,0,0.2,1);animation-timing-function:cubic-bezier(0,0,0.2,1)}}@keyframes bounce{0%,100%{transform:translateY(-25%);-webkit-animation-timing-function:cubic-bezier(0.8,0,1,1);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;-webkit-animation-timing-function:cubic-bezier(0,0,0.2,1);animation-timing-function:cubic-bezier(0,0,0.2,1)}}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.whitespace-nowrap{white-space:nowrap}.rounded{border-radius:0.25rem}.rounded-lg{border-radius:0.5rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.border-r{border-right-width:1px}.border-b{border-bottom-width:1px}.bg-white{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgba(229, 231, 235, var(--tw-bg-opacity))}.bg-gray-600{--tw-bg-opacity:1;background-color:rgba(75, 85, 99, var(--tw-bg-opacity))}.bg-red-600{--tw-bg-opacity:1;background-color:rgba(220, 38, 38, var(--tw-bg-opacity))}.bg-yellow-600{--tw-bg-opacity:1;background-color:rgba(217, 119, 6, var(--tw-bg-opacity))}.bg-green-600{--tw-bg-opacity:1;background-color:rgba(5, 150, 105, var(--tw-bg-opacity))}.bg-blue-600{--tw-bg-opacity:1;background-color:rgba(37, 99, 235, var(--tw-bg-opacity))}.bg-indigo-600{--tw-bg-opacity:1;background-color:rgba(79, 70, 229, var(--tw-bg-opacity))}.bg-purple-600{--tw-bg-opacity:1;background-color:rgba(124, 58, 237, var(--tw-bg-opacity))}.bg-pink-600{--tw-bg-opacity:1;background-color:rgba(219, 39, 119, var(--tw-bg-opacity))}.hover-bg-gray-200:hover{--tw-bg-opacity:1;background-color:rgba(229, 231, 235, var(--tw-bg-opacity))}.hover-bg-gray-300:hover{--tw-bg-opacity:1;background-color:rgba(209, 213, 219, var(--tw-bg-opacity))}.hover-bg-gray-500:hover{--tw-bg-opacity:1;background-color:rgba(107, 114, 128, var(--tw-bg-opacity))}.focus-bg-gray-300:focus{--tw-bg-opacity:1;background-color:rgba(209, 213, 219, var(--tw-bg-opacity))}.focus-bg-gray-400:focus{--tw-bg-opacity:1;background-color:rgba(156, 163, 175, var(--tw-bg-opacity))}.bg-gradient-to-b{background-image:linear-gradient(to bottom, var(--tw-gradient-stops))}.from-gray-800{--tw-gradient-from:#1f2937;--tw-gradient-stops:var(--tw-gradient-from), var(--tw-gradient-to, rgba(31, 41, 55, 0))}.to-gray-700{--tw-gradient-to:#374151}.p-0{padding:0}.p-1{padding:0.25rem}.p-2{padding:0.5rem}.p-3{padding:0.75rem}.p-0-5{padding:0.125rem}.px-2{padding-left:0.5rem;padding-right:0.5rem}.pr-1{padding-right:0.25rem}.pl-2{padding-left:0.5rem}.text-xs{font-size:0.75rem;line-height:1rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-2xl{font-size:1.5rem;line-height:2rem}.font-semibold{font-weight:600}.text-white{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgba(107, 114, 128, var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity:1;color:rgba(75, 85, 99, var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity:1;color:rgba(31, 41, 55, var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity:1;color:rgba(17, 24, 39, var(--tw-text-opacity))}.text-red-100{--tw-text-opacity:1;color:rgba(254, 226, 226, var(--tw-text-opacity))}.text-yellow-100{--tw-text-opacity:1;color:rgba(254, 243, 199, var(--tw-text-opacity))}.text-green-100{--tw-text-opacity:1;color:rgba(209, 250, 229, var(--tw-text-opacity))}.text-blue-100{--tw-text-opacity:1;color:rgba(219, 234, 254, var(--tw-text-opacity))}.text-indigo-100{--tw-text-opacity:1;color:rgba(224, 231, 255, var(--tw-text-opacity))}.text-purple-100{--tw-text-opacity:1;color:rgba(237, 233, 254, var(--tw-text-opacity))}.text-pink-100{--tw-text-opacity:1;color:rgba(252, 231, 243, var(--tw-text-opacity))}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*,::after,::before{--tw-shadow:0 0 #0000}.shadow-sm{--tw-shadow:0 1px 2px 0 rgba(0, 0, 0, 0.05);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.focus-outline-none:focus{outline:2px solid transparent;outline-offset:2px}*,::after,::before{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59, 130, 246, 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000}.filter{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/);filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-300{transition-duration:300ms}.ease-in-out{transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}@media (min-width: 640px){}@media (min-width: 768px){}@media (min-width: 1024px){}@media (min-width: 1280px){}@media (min-width: 1536px){}

    .rounded-2xl {
        border-radius: 24px;
    }

    .hover-rounded-xl:hover {
        border-radius: .75rem;
    }

    .bg-image {
        background: url("${backgroundImage}");
        background-repeat: no-repeat;
        background-size: cover;
    }
`

// get html element
const html = document.getElementsByTagName('html')[0]

// remove body and make a new one
html.removeChild(document.body)
html.appendChild(document.createElement('body'))
document.body.onload = null

// clear head
document.head.innerHTML = ''
// set lang based on users language
document.documentElement.lang = navigator.language

// create all the elements
const headDiv = document.querySelector('head')
const bodyDiv = document.querySelector('body')
const injectorDiv = document.createElement('div')
const metaDescription = document.createElement('meta')
const metaViewport = document.createElement('meta')
const metaCharset = document.createElement('meta')
const styleElem = document.createElement('style')
const faviconElem = document.createElement('link')

// style element
styleElem.innerHTML = style

// favicon element
faviconElem.setAttribute('rel', 'icon')
faviconElem.setAttribute('type', 'image/png')
faviconElem.setAttribute('href', 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUdwTP/MAf/MAf/MAf/MAf/MAf/MAf/MAf/MAf/MAf/MAf/MAf/MAf/MAf/MAaO79icAAAAOdFJOUwBM9Aij0oHjKmUYuzWSsqMTuAAAAIFJREFUCNdjYAADi2kQmsP9LZg2YHunCKINk1neRQFprktVpu8cgIzV73Ta300AMg69eyj3vIGBoVnu3bO81wYMjDHz3j3Z94yB4eize0rP64C6/Z7u2/oOpFv83bu0dyDdnO/eTdQD6Wb2eycV9xSom6FdZYGTB8gmzskMggYMDAApoC+qu9jRWwAAAABJRU5ErkJggg==')

// set document tile
document.title = 'ELO'

// meta discription
metaDescription.name = 'description'
metaDescription.setAttribute('content', 'the better elo')

// viewport meta
metaViewport.name = 'viewport'
metaViewport.setAttribute('content', 'width=device-width, initial-scale=1')

// meta charset
metaCharset.setAttribute('charset', 'UTF-8')

// append all elements
headDiv.appendChild(faviconElem)
headDiv.appendChild(styleElem)
headDiv.appendChild(metaDescription)
headDiv.appendChild(metaViewport)
headDiv.appendChild(metaCharset)
bodyDiv.appendChild(injectorDiv)

// the vue instance
new Vue({
    el: injectorDiv,
    template: '<App/>',
    components: { App }
})

// static lists
// the abbreviations for all of the diferent courses, needs to be updated
const abbreviations = {
    75552: 'AFO',
    75740: 'DB',
    75734: 'ENG1',
    75569: 'JAVA',
    75542: 'KBS1',
    75571: 'KBS2',
    75513: 'NL',
    75539: 'PS',
    75551: 'PM',
    75733: 'ROBO',
    53987: 'SCHR'
}

// icon list for the difrent file types
const icons = {
    folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    openFolder: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z',
    link: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
    file: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    downloadFile: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    downloadFolder: 'M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
    image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    upload: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
}

// color stings for the diferent courses
const colorStrings = ['bg-blue-600 text-blue-100', 'bg-yellow-600 text-yellow-100', 'bg-green-600 text-green-100', 'bg-red-600 text-red-100', 'bg-indigo-600 text-indigo-100', 'bg-purple-600 text-purple-100', 'bg-pink-600 text-pink-100', 'bg-yellow-600 text-yellow-100', 'bg-red-600 text-red-100', 'bg-red-600 text-red-100',]
