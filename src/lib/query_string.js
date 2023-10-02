

export default function getParameterByName(name) {
    const url = new URL(document.location.toString());
    return url.searchParams.get(name);
}
