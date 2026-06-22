import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AllergenType {
  DRUG = 'drug',
  FOOD = 'food',
  OTHER = 'other',
}

export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

@Entity('allergies')
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ type: 'enum', enum: AllergenType, name: 'allergen_type', default: AllergenType.OTHER })
  allergenType: AllergenType;

  @Column({ name: 'allergen_name' })
  allergenName: string;

  @Column({ type: 'enum', enum: AllergySeverity, default: AllergySeverity.MILD })
  severity: AllergySeverity;

  @Column({ type: 'text', name: 'reaction_description', nullable: true })
  reactionDescription: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
