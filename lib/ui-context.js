import * as React from 'react'

const DarkmodeContext = React.createContext()

function DarkmodeProvider({ children }) {
    const [darkmode, setDarkmode] = React.useState(false)
    const value = { darkmode, setDarkmode };
    return <DarkmodeContext.Provider value={value}>{children}</DarkmodeContext.Provider>

}

function useDarkmode() {
    const context = React.useContext(DarkmodeContext)
    if (context === undefined) {
        throw new Error('useDarkmode must be used within a DarkmodeProvider')
    }
    return context
}

export { DarkmodeProvider, useDarkmode }