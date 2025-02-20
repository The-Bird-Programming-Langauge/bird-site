
export async function getCode(name: string) {
    const response = await fetch(`/${name}.bird`);
    if (!response.ok) {
        return 'Error fetching code';
    }
    return await response.text();
}