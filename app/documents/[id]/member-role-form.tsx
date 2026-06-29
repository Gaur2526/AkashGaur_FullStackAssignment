import { DocumentRole } from "@prisma/client";
import { updateMemberRoleAction } from "./actions";

type MemberRoleFormProps = {
  documentId: string;
  memberId: string;
  currentRole: DocumentRole;
};

export function MemberRoleForm({
  documentId,
  memberId,
  currentRole,
}: MemberRoleFormProps) {
  return (
    <form action={updateMemberRoleAction} className="flex items-center gap-2">
      <input type="hidden" name="documentId" value={documentId} />
      <input type="hidden" name="memberId" value={memberId} />
      <select
        key={currentRole}
        name="role"
        defaultValue={currentRole}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
      >
        <option value={DocumentRole.EDITOR}>Editor</option>
        <option value={DocumentRole.VIEWER}>Viewer</option>
      </select>
      <button
        type="submit"
        className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
      >
        Save
      </button>
    </form>
  );
}
