import Hello from "./components/hello";

export default function Home() {
  console.log('What am i server or client component? -- SERVER')
  return (
    <>
      <h1 className="text-3xl">Welcome to Next.js</h1>
      <Hello />
    </>
  );
}
