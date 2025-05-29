// src/discord/roles.js
import { getGuildRoles, addRoleToMember } from './api.js';


/**
 * Assign roles to a user based on registration data
 * extensible to add more roles
 */
export async function assignRoles(userId, eventYear, env) {
  // debugger
  const assignedRoles = [];

  // Get all roles in the guild
  // what does this oject look like?
  const roles = await getGuildRoles(env);

  // Find the role by name (should match the year)
  const role = roles.find(role => role.name === eventYear);
  if (!role) {
    throw new Error(`Role "${eventYear}" not found in guild.`);
  }

  // Add the main attendee role .eg 2023
  await addRoleToMember(userId, role.id, env);
  assignedRoles.push(role.name);

  return assignedRoles;
}
