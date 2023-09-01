import { StaticPageWrapper } from "@/components/StaticPageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile() {
  return (
    <StaticPageWrapper pageTitle="Profile" description="Edit your profile">
      <section className="grid border rounded-lg p-4 shadow">
        <h2 className="text-2xl">Username</h2>
        <p className="text-neutral-400 max-w-2xl">
          Your username is how other people will identify you on the platform.
        </p>
        <div className="flex gap-2 items-center mt-4">
          <Input placeholder="Username" id="username" defaultValue="" />
          <Button>Save</Button>
        </div>
      </section>
      {/* <section className="grid border rounded-lg p-4 shadow mt-4">
        <h2 className="text-2xl">Delete Account</h2>
        <p className="text-neutral-400 max-w-2xl">
          Deleting your account will permanently delete all of your projects and
          data.
        </p>
        <div className="flex gap-2 items-center mt-4">
          <Button
            variant="destructive"
            onClick={() => {
              window.alert("Sorry, this is not implemented yet!");
            }}
          >
            Delete Account
          </Button>
        </div>
      </section> */}
    </StaticPageWrapper>
  );
}
