export { };
// Extending String: https://stackoverflow.com/questions/45437974/typescript-extend-string-interface-runtime-error
declare global {
    interface String {
        toTitleCase(): string;

        capitalize(): string;
    }
}
