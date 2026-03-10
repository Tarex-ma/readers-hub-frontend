export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Reader's Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}