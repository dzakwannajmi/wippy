export const QUESTION_BANK = {
    PHP: [
        {
            question: "Apa fungsi dari 'echo' di PHP?",
            options: ["Input Data", "Output Teks", "Hapus Variabel", "Koneksi Database"],
            answer: 1,
        },
        {
            question: "Variabel di PHP selalu dimulai dengan simbol?",
            options: ["#", "@", "$", "&"],
            answer: 2,
        },
        {
            question: "Fungsi untuk mendapatkan panjang string di PHP?",
            options: ["length()", "strlen()", "strcount()", "size()"],
            answer: 1,
        },
        {
            question: "Cara menulis komentar satu baris di PHP?",
            options: ["/* komentar */", "<!-- komentar -->", "// komentar", "## komentar"],
            answer: 2,
        },
        {
            question: "Fungsi untuk menggabungkan array di PHP?",
            options: ["array_merge()", "array_join()", "array_combine()", "array_push()"],
            answer: 0,
        },
        {
            question: "Cara membuat array di PHP?",
            options: ["array = []", "$array = []", "#array = []", "@array = []"],
            answer: 1,
        },
        {
            question: "Fungsi untuk mengubah string menjadi huruf besar di PHP?",
            options: ["toUpper()", "str_upper()", "strtoupper()", "uppercase()"],
            answer: 2,
        },
        {
            question: "Apa ekstensi file PHP?",
            options: [".ph", ".php", ".php3", ".phpp"],
            answer: 1,
        },
        {
            question: "Operator perbandingan identik di PHP adalah?",
            options: ["==", "!=", "===", "!=="],
            answer: 2,
        },
        {
            question: "Fungsi untuk menghitung jumlah elemen array di PHP?",
            options: ["length()", "size()", "count()", "total()"],
            answer: 2,
        },
        {
            question: "Cara mengakses elemen pertama array $arr di PHP?",
            options: ["$arr[1]", "$arr[0]", "$arr.first()", "$arr->0"],
            answer: 1,
        },
        {
            question: "Fungsi untuk mengecek apakah variabel kosong di PHP?",
            options: ["isNull()", "isEmpty()", "empty()", "isVoid()"],
            answer: 2,
        },
        {
            question: "Apa output dari: echo 10 % 3; di PHP?",
            options: ["3", "1", "0", "2"],
            answer: 1,
        },
        {
            question: "Cara include file lain di PHP?",
            options: ["import 'file.php'", "require 'file.php'", "load 'file.php'", "fetch 'file.php'"],
            answer: 1,
        },
        {
            question: "Superglobal untuk mengambil data dari form POST di PHP?",
            options: ["$_GET", "$_POST", "$_REQUEST", "$_FORM"],
            answer: 1,
        },
        {
            question: "Fungsi untuk memecah string menjadi array di PHP?",
            options: ["str_split()", "explode()", "split()", "chunk()"],
            answer: 1,
        },
        {
            question: "Cara mendefinisikan konstanta di PHP?",
            options: ["const NAME = value", "define('NAME', value)", "let NAME = value", "final NAME = value"],
            answer: 1,
        },
        {
            question: "Fungsi untuk mengecek tipe data di PHP?",
            options: ["typeOf()", "gettype()", "checktype()", "typeof()"],
            answer: 1,
        },
        {
            question: "Apa fungsi isset() di PHP?",
            options: [
                "Menghapus variabel",
                "Mengecek apakah variabel sudah didefinisikan dan tidak null",
                "Membuat variabel baru",
                "Mengeset nilai variabel"
            ],
            answer: 1,
        },
        {
            question: "Cara membuat loop di PHP yang pasti dijalankan minimal sekali?",
            options: ["for", "while", "do...while", "foreach"],
            answer: 2,
        },
    ],

    JAVASCRIPT: [
        {
            question: "Cara mendeklarasikan variabel yang nilainya tidak bisa diubah?",
            options: ["let", "var", "const", "static"],
            answer: 2,
        },
        {
            question: "Apa hasil dari typeof []?",
            options: ["array", "object", "null", "undefined"],
            answer: 1,
        },
        {
            question: "Method array untuk menambah elemen di akhir?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            answer: 0,
        },
        {
            question: "Cara membuat arrow function di JavaScript?",
            options: [
                "function => () {}",
                "const fn = () => {}",
                "fn() -> {}",
                "def fn() {}"
            ],
            answer: 1,
        },
        {
            question: "Apa hasil dari: console.log(0 == '0')?",
            options: ["false", "true", "undefined", "error"],
            answer: 1,
        },
        {
            question: "Apa hasil dari: console.log(0 === '0')?",
            options: ["true", "false", "undefined", "error"],
            answer: 1,
        },
        {
            question: "Method untuk menghapus elemen terakhir array?",
            options: ["push()", "pop()", "slice()", "splice()"],
            answer: 1,
        },
        {
            question: "Cara mengakses properti objek di JavaScript?",
            options: ["obj->name", "obj::name", "obj.name", "obj[name]"],
            answer: 2,
        },
        {
            question: "Fungsi built-in untuk mengubah string ke integer?",
            options: ["toInt()", "parseInt()", "Number.toInt()", "convertInt()"],
            answer: 1,
        },
        {
            question: "Apa itu closure di JavaScript?",
            options: [
                "Fungsi yang menutup program",
                "Fungsi yang mengakses variabel dari scope luarnya",
                "Cara menutup koneksi database",
                "Method untuk menutup modal"
            ],
            answer: 1,
        },
        {
            question: "Method array untuk membuat array baru hasil transformasi?",
            options: ["forEach()", "filter()", "map()", "reduce()"],
            answer: 2,
        },
        {
            question: "Apa hasil dari: typeof null?",
            options: ["null", "undefined", "object", "string"],
            answer: 2,
        },
        {
            question: "Cara membuat Promise di JavaScript?",
            options: [
                "new Promise((resolve, reject) => {})",
                "Promise.create(() => {})",
                "async Promise() {}",
                "promise(() => {})"
            ],
            answer: 0,
        },
        {
            question: "Apa fungsi dari async/await di JavaScript?",
            options: [
                "Membuat kode berjalan lebih cepat",
                "Menangani operasi asynchronous dengan syntax yang lebih bersih",
                "Membuat multiple thread",
                "Mengoptimasi performa"
            ],
            answer: 1,
        },
        {
            question: "Method untuk menggabungkan dua array di JavaScript?",
            options: ["join()", "merge()", "concat()", "combine()"],
            answer: 2,
        },
        {
            question: "Apa itu event bubbling di JavaScript?",
            options: [
                "Animasi gelembung di CSS",
                "Event yang merambat dari child ke parent element",
                "Cara membuat event baru",
                "Method untuk menghapus event listener"
            ],
            answer: 1,
        },
        {
            question: "Cara destructuring array di JavaScript?",
            options: [
                "const {a, b} = arr",
                "const [a, b] = arr",
                "const (a, b) = arr",
                "const <a, b> = arr"
            ],
            answer: 1,
        },
        {
            question: "Apa hasil dari: [1,2,3].reduce((acc, val) => acc + val, 0)?",
            options: ["123", "6", "0", "undefined"],
            answer: 1,
        },
        {
            question: "Spread operator di JavaScript menggunakan simbol?",
            options: ["..", "...", "**", "->"],
            answer: 1,
        },
        {
            question: "Method untuk mengecek apakah semua elemen array memenuhi kondisi?",
            options: ["some()", "every()", "find()", "includes()"],
            answer: 1,
        },
    ],

    CSS: [
        {
            question: "Properti untuk mengubah warna latar belakang?",
            options: ["color", "bg-color", "background-color", "fill"],
            answer: 2,
        },
        {
            question: "Properti CSS untuk mengubah ukuran font?",
            options: ["text-size", "font-size", "font-weight", "text-scale"],
            answer: 1,
        },
        {
            question: "Value display untuk membuat flexbox?",
            options: ["block", "inline", "flex", "grid"],
            answer: 2,
        },
        {
            question: "Properti untuk memberi jarak di dalam elemen (dalam border)?",
            options: ["margin", "padding", "spacing", "gap"],
            answer: 1,
        },
        {
            question: "Properti untuk memberi jarak di luar elemen (luar border)?",
            options: ["padding", "margin", "border", "outline"],
            answer: 1,
        },
        {
            question: "Selector CSS untuk memilih elemen dengan id 'header'?",
            options: [".header", "#header", "*header", "@header"],
            answer: 1,
        },
        {
            question: "Selector CSS untuk memilih elemen dengan class 'btn'?",
            options: ["#btn", ".btn", "*btn", "btn"],
            answer: 1,
        },
        {
            question: "Properti untuk mengatur posisi elemen secara absolut?",
            options: ["display: absolute", "position: absolute", "float: absolute", "align: absolute"],
            answer: 1,
        },
        {
            question: "Cara membuat teks menjadi tebal di CSS?",
            options: ["font-style: bold", "text-weight: bold", "font-weight: bold", "text-style: bold"],
            answer: 2,
        },
        {
            question: "Properti untuk mengatur transparansi elemen?",
            options: ["transparency", "visibility", "opacity", "alpha"],
            answer: 2,
        },
        {
            question: "Unit CSS yang relatif terhadap ukuran viewport width?",
            options: ["px", "em", "rem", "vw"],
            answer: 3,
        },
        {
            question: "Properti flexbox untuk mengatur alignment di sumbu utama?",
            options: ["align-items", "justify-content", "flex-direction", "flex-wrap"],
            answer: 1,
        },
        {
            question: "Cara membuat border radius melingkar sempurna?",
            options: ["border-radius: 0", "border-radius: 100px", "border-radius: 50%", "border-radius: round"],
            answer: 2,
        },
        {
            question: "Properti untuk mengatur urutan stack elemen?",
            options: ["stack-order", "z-index", "layer", "depth"],
            answer: 1,
        },
        {
            question: "Pseudo-class untuk style saat hover?",
            options: [":hover", "::hover", ".hover", "#hover"],
            answer: 0,
        },
        {
            question: "Properti untuk menyembunyikan elemen tapi tetap occupying space?",
            options: ["display: none", "visibility: hidden", "opacity: 0", "hidden: true"],
            answer: 1,
        },
        {
            question: "CSS Grid property untuk mendefinisikan kolom?",
            options: ["grid-columns", "grid-template-columns", "column-template", "grid-cols"],
            answer: 1,
        },
        {
            question: "Cara membuat animasi CSS?",
            options: ["@transition", "@animation", "@keyframes", "@motion"],
            answer: 2,
        },
        {
            question: "Properti untuk mengatur jarak antar elemen dalam flexbox/grid?",
            options: ["spacing", "margin", "gap", "padding"],
            answer: 2,
        },
        {
            question: "Media query untuk layar dengan lebar maksimal 768px?",
            options: [
                "@media (min-width: 768px)",
                "@media (max-width: 768px)",
                "@media screen 768px",
                "@media (width: 768px)"
            ],
            answer: 1,
        },
    ],

    REACT: [
        {
            question: "Hook untuk menyimpan state di functional component?",
            options: ["useEffect", "useRef", "useState", "useContext"],
            answer: 2,
        },
        {
            question: "Hook untuk side effects di React?",
            options: ["useState", "useEffect", "useCallback", "useMemo"],
            answer: 1,
        },
        {
            question: "Cara passing data dari parent ke child component?",
            options: ["state", "props", "context", "ref"],
            answer: 1,
        },
        {
            question: "Apa itu JSX di React?",
            options: [
                "JavaScript Extension untuk database",
                "Syntax extension yang memungkinkan menulis HTML di JavaScript",
                "Library untuk styling",
                "Package manager React"
            ],
            answer: 1,
        },
        {
            question: "Key prop pada list di React berfungsi untuk?",
            options: [
                "Styling elemen list",
                "Membantu React mengidentifikasi item yang berubah",
                "Mengurutkan list",
                "Memberi akses keyboard"
            ],
            answer: 1,
        },
        {
            question: "Hook untuk memoize nilai agar tidak dihitung ulang?",
            options: ["useCallback", "useRef", "useMemo", "useReducer"],
            answer: 2,
        },
        {
            question: "Cara update state array di React tanpa mutasi?",
            options: [
                "state.push(newItem)",
                "setState([...state, newItem])",
                "state.add(newItem)",
                "setState(state + newItem)"
            ],
            answer: 1,
        },
        {
            question: "Apa itu Virtual DOM di React?",
            options: [
                "DOM yang tersimpan di database",
                "Representasi ringan dari DOM asli di memori",
                "DOM untuk virtual reality",
                "Plugin untuk manipulasi DOM"
            ],
            answer: 1,
        },
        {
            question: "Hook untuk menyimpan referensi ke DOM element?",
            options: ["useState", "useEffect", "useRef", "useContext"],
            answer: 2,
        },
        {
            question: "Cara conditional rendering di React?",
            options: [
                "if/else statement saja",
                "Ternary operator atau && operator",
                "switch statement saja",
                "try/catch saja"
            ],
            answer: 1,
        },
        {
            question: "React.Fragment digunakan untuk?",
            options: [
                "Memecah komponen",
                "Membungkus multiple element tanpa tambah DOM node",
                "Membuat animasi",
                "Mengoptimasi performa"
            ],
            answer: 1,
        },
        {
            question: "Hook untuk share state tanpa prop drilling?",
            options: ["useState", "useReducer", "useContext", "useRef"],
            answer: 2,
        },
        {
            question: "Lifecycle yang setara dengan useEffect(() => {}, []) di class component?",
            options: ["componentDidUpdate", "componentWillUnmount", "componentDidMount", "shouldComponentUpdate"],
            answer: 2,
        },
        {
            question: "Cara mencegah re-render component yang tidak perlu?",
            options: ["React.lazy", "React.memo", "React.Fragment", "React.strict"],
            answer: 1,
        },
        {
            question: "Apa itu controlled component di React?",
            options: [
                "Component yang dikontrol CSS",
                "Form element yang nilainya dikontrol oleh React state",
                "Component dengan akses penuh ke DOM",
                "Component yang tidak bisa di-render ulang"
            ],
            answer: 1,
        },
        {
            question: "Package untuk routing di React?",
            options: ["react-router", "react-navigation", "react-router-dom", "react-path"],
            answer: 2,
        },
        {
            question: "useCallback digunakan untuk?",
            options: [
                "Membuat callback baru setiap render",
                "Memoize fungsi agar referensinya stabil",
                "Menjalankan callback setelah render",
                "Menghapus event listener"
            ],
            answer: 1,
        },
        {
            question: "Cara lazy loading component di React?",
            options: [
                "React.lazy(() => import('./Component'))",
                "lazy.import('./Component')",
                "React.import('./Component')",
                "import.lazy('./Component')"
            ],
            answer: 0,
        },
        {
            question: "Error boundary di React digunakan untuk?",
            options: [
                "Validasi form",
                "Menangkap JavaScript error di component tree",
                "Membatasi ukuran bundle",
                "Mengatur batas animasi"
            ],
            answer: 1,
        },
        {
            question: "Apa perbedaan useEffect dengan useLayoutEffect?",
            options: [
                "Tidak ada perbedaan",
                "useLayoutEffect berjalan setelah browser paint, useEffect sebelumnya",
                "useLayoutEffect berjalan sebelum browser paint, useEffect setelahnya",
                "useLayoutEffect hanya untuk styling"
            ],
            answer: 2,
        },
    ],
};